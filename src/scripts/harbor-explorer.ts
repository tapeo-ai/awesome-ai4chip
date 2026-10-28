interface HarborFile { path: string; size: number; url: string; }
interface HarborDependency { path: string; size?: number | null; version?: string | null; }
interface HarborTask {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  files: HarborFile[];
  dependencies: HarborDependency[];
  archive?: { name: string | null; size: number | null } | null;
  platform?: string | null;
}
interface Directory { name: string; folders: Map<string, Directory>; files: HarborFile[]; count: number; }

const strings = {
  zh: {
    files: (n: number) => `${n} 个文件`,
    matches: (n: number, total: number) => `${n} / ${total} 个文件`,
    noMatches: '没有匹配的文件。', empty: '这个环境还没有可浏览的文件。',
    loading: '加载中…', failure: '文件加载失败，请重试或直接下载。',
    copy: '复制', copied: '已复制', copyFailure: '浏览器未允许复制，可在内容区手动选择。',
    emptyFile: '此文件为空。', source: '在 GitHub 查看',
  },
  en: {
    files: (n: number) => `${n} ${n === 1 ? 'file' : 'files'}`,
    matches: (n: number, total: number) => `${n} / ${total} files`,
    noMatches: 'No matching files.', empty: 'This environment has no files to browse yet.',
    loading: 'Loading…', failure: 'Unable to load this file. Retry or download it directly.',
    copy: 'Copy', copied: 'Copied', copyFailure: 'Copy is unavailable. You can select the text in the content pane.',
    emptyFile: 'This file is empty.', source: 'View on GitHub',
  },
};

function formatSize(size: number | null | undefined): string {
  if (size === null || size === undefined || !Number.isFinite(size)) return '';
  if (size < 1024) return `${size} B`;
  const unit = size < 1024 ** 2 ? 'KiB' : size < 1024 ** 3 ? 'MiB' : 'GiB';
  const divisor = unit === 'KiB' ? 1024 : unit === 'MiB' ? 1024 ** 2 : 1024 ** 3;
  return `${(size / divisor).toFixed(1)} ${unit}`;
}

function directory(files: HarborFile[]): Directory {
  const root: Directory = { name: '', folders: new Map(), files: [], count: files.length };
  for (const file of files) {
    const parts = file.path.split('/');
    let branch = root;
    for (const name of parts.slice(0, -1)) {
      let next = branch.folders.get(name);
      if (!next) {
        next = { name, folders: new Map(), files: [], count: 0 };
        branch.folders.set(name, next);
      }
      next.count += 1;
      branch = next;
    }
    branch.files.push(file);
  }
  return root;
}

function initialize(root: HTMLElement) {
  if (root.dataset.ready) return;
  const json = root.querySelector<HTMLScriptElement>('[data-harbor-data]');
  if (!json) return;
  let tasks: HarborTask[];
  try { tasks = JSON.parse(json.textContent || '[]'); }
  catch { return; }
  if (!tasks.length) return;
  root.dataset.ready = 'true';

  const locale = root.dataset.locale === 'en' ? 'en' : 'zh';
  const t = strings[locale];
  const get = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const tree = get<HTMLElement>('[data-file-tree]');
  const search = get<HTMLInputElement>('[data-file-search]');
  const count = get<HTMLElement>('[data-file-count]');
  const taskSelect = root.querySelector<HTMLSelectElement>('[data-task-select]');
  const code = get<HTMLElement>('[data-file-code]');
  const pane = get<HTMLPreElement>('[data-code-pane]');
  const loadState = get<HTMLElement>('[data-load-state]');
  const loadMessage = get<HTMLElement>('[data-load-message]');
  const retry = get<HTMLButtonElement>('[data-retry-file]');
  const copy = get<HTMLButtonElement>('[data-copy-file]');
  const download = get<HTMLAnchorElement>('[data-download-file]');
  const feedback = get<HTMLElement>('[data-file-feedback]');
  const instruction = get<HTMLButtonElement>('[data-open-instruction]');
  const readme = get<HTMLButtonElement>('[data-open-readme]');
  const cache = new Map<string, string>();
  let task = tasks[0];
  let selected: HarborFile | undefined;
  let source: string | null = null;
  let request: AbortController | undefined;
  let sequence = 0;
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  const findReadme = () => task.files.find(file => file.path === (locale === 'en' ? 'README.en.md' : 'README.md'))
    || task.files.find(file => file.path === 'README.md');
  const findInstruction = () => task.files.find(file => file.path === 'instruction.md');

  function markSelected() {
    for (const button of tree.querySelectorAll<HTMLButtonElement>('button[data-file]')) {
      if (button.dataset.file === selected?.path) {
        button.setAttribute('aria-current', 'true');
        let ancestor = button.parentElement;
        while (ancestor && ancestor !== tree) {
          if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
          ancestor = ancestor.parentElement;
        }
      } else button.removeAttribute('aria-current');
    }
  }

  function renderDirectory(branch: Directory, depth: number, filtering: boolean): HTMLUListElement {
    const list = document.createElement('ul');
    const compare = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
    for (const folder of [...branch.folders.values()].sort((a, b) => compare(a.name, b.name))) {
      const item = document.createElement('li');
      const details = document.createElement('details');
      details.open = filtering || depth === 0;
      const summary = document.createElement('summary');
      summary.append(document.createTextNode(folder.name));
      const size = document.createElement('span');
      size.className = 'hx-folder-count';
      size.textContent = String(folder.count);
      summary.append(size);
      details.append(summary, renderDirectory(folder, depth + 1, filtering));
      item.append(details);
      list.append(item);
    }
    for (const file of [...branch.files].sort((a, b) => compare(a.path, b.path))) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'hx-file';
      button.dataset.file = file.path;
      button.title = file.path;
      button.textContent = file.path.split('/').at(-1) || file.path;
      item.append(button);
      list.append(item);
    }
    return list;
  }

  function renderTree() {
    const query = search.value.trim().toLowerCase();
    const files = task.files.filter(file => file.path.toLowerCase().includes(query));
    count.textContent = query ? t.matches(files.length, task.files.length) : t.files(task.files.length);
    if (files.length) tree.replaceChildren(renderDirectory(directory(files), 0, Boolean(query)));
    else {
      const message = document.createElement('p');
      message.className = 'hx-no-results';
      message.textContent = query ? t.noMatches : t.empty;
      tree.replaceChildren(message);
    }
    markSelected();
  }

  function writeHash(file: HarborFile) {
    const params = new URLSearchParams({ task: task.id, file: file.path });
    history.replaceState(null, '', `${location.pathname}${location.search}#${params}`);
  }

  async function openFile(file: HarborFile, updateHash = true) {
    selected = file;
    source = null;
    request?.abort();
    const current = ++sequence;
    request = new AbortController();
    clearTimeout(copyTimer);
    copy.textContent = t.copy;
    copy.disabled = true;
    code.textContent = '';
    feedback.textContent = '';
    pane.hidden = true;
    loadState.hidden = false;
    loadMessage.textContent = t.loading;
    retry.hidden = true;
    get<HTMLElement>('[data-file-path]').textContent = file.path;
    get<HTMLElement>('[data-file-size]').textContent = formatSize(file.size);
    download.href = file.url;
    download.download = file.path.split('/').at(-1) || file.path;
    download.removeAttribute('aria-disabled');
    markSelected();
    if (updateHash) writeHash(file);

    try {
      let text = cache.get(file.url);
      if (text === undefined) {
        const response = await fetch(file.url, { signal: request.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        text = await response.text();
        cache.set(file.url, text);
      }
      if (current !== sequence) return;
      source = text;
      // Never parse source files as HTML, including Markdown and SVG files.
      code.textContent = text;
      loadState.hidden = true;
      pane.hidden = false;
      pane.scrollTop = 0;
      pane.scrollLeft = 0;
      copy.disabled = false;
      if (!text.length) feedback.textContent = t.emptyFile;
    } catch (error) {
      if (current !== sequence || (error instanceof DOMException && error.name === 'AbortError')) return;
      loadMessage.textContent = t.failure;
      retry.hidden = false;
    }
  }

  function changeTask(next: HarborTask, path?: string, updateHash = true) {
    request?.abort();
    sequence += 1;
    task = next;
    selected = undefined;
    source = null;
    search.value = '';
    if (taskSelect) taskSelect.value = task.id;
    get<HTMLElement>('[data-task-title]').textContent = task.id;
    get<HTMLElement>('[data-task-description]').textContent = task.description;
    const metadata = get<HTMLElement>('[data-task-meta]');
    metadata.replaceChildren();
    for (const value of [task.platform, task.archive?.name && [task.archive.name, formatSize(task.archive.size)].filter(Boolean).join(' · ')]) {
      if (!value) continue;
      const item = document.createElement('span');
      item.textContent = value;
      metadata.append(item);
    }
    const sourceLink = document.createElement('a');
    sourceLink.href = task.sourceUrl;
    sourceLink.textContent = t.source;
    metadata.append(sourceLink);
    const dependencies = get<HTMLDetailsElement>('[data-dependencies]');
    dependencies.hidden = !task.dependencies.length;
    dependencies.open = false;
    get<HTMLElement>('[data-dependency-count]').textContent = `(${task.dependencies.length})`;
    const dependencyList = get<HTMLElement>('[data-dependency-list]');
    dependencyList.replaceChildren();
    for (const dependency of task.dependencies) {
      const item = document.createElement('li');
      item.append(document.createTextNode(dependency.path));
      const detail = document.createElement('span');
      detail.textContent = [dependency.version, formatSize(dependency.size)].filter(Boolean).join(' · ');
      item.append(detail);
      dependencyList.append(item);
    }
    instruction.disabled = !findInstruction();
    readme.disabled = !findReadme();
    renderTree();
    const file = task.files.find(file => file.path === path) || findInstruction() || findReadme() || task.files[0];
    if (file) void openFile(file, updateHash);
    else {
      code.textContent = '';
      pane.hidden = true;
      loadState.hidden = false;
      loadMessage.textContent = t.empty;
      retry.hidden = true;
      copy.disabled = true;
      feedback.textContent = '';
      get<HTMLElement>('[data-file-path]').textContent = '';
      get<HTMLElement>('[data-file-size]').textContent = '';
      download.removeAttribute('href');
      download.setAttribute('aria-disabled', 'true');
    }
  }

  function restoreHash() {
    const params = new URLSearchParams(location.hash.slice(1));
    const target = tasks.find(item => item.id === params.get('task'));
    if (!target) return false;
    changeTask(target, params.get('file') || undefined, false);
    return true;
  }

  tree.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-file]');
    const file = task.files.find(item => item.path === button?.dataset.file);
    if (file) void openFile(file);
  });
  search.addEventListener('input', renderTree);
  taskSelect?.addEventListener('change', () => {
    const next = tasks.find(item => item.id === taskSelect.value);
    if (next) changeTask(next);
  });
  instruction.addEventListener('click', () => { const file = findInstruction(); if (file) void openFile(file); });
  readme.addEventListener('click', () => { const file = findReadme(); if (file) void openFile(file); });
  retry.addEventListener('click', () => { if (selected) void openFile(selected, false); });
  copy.addEventListener('click', async () => {
    if (source === null) return;
    const fileAtCopy = selected;
    try {
      await navigator.clipboard.writeText(source);
      if (fileAtCopy !== selected) return;
      copy.textContent = t.copied;
      copyTimer = setTimeout(() => { copy.textContent = t.copy; }, 1800);
    } catch { if (fileAtCopy === selected) feedback.textContent = t.copyFailure; }
  });
  window.addEventListener('hashchange', restoreHash);
  if (!restoreHash()) changeTask(tasks[0], undefined, false);
}

function initializeExplorers() {
  document.querySelectorAll<HTMLElement>('[data-harbor-explorer]').forEach(initialize);
}
initializeExplorers();
document.addEventListener('astro:page-load', initializeExplorers);

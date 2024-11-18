
const _log = (...strs: any[]) => {
    // if (!strs[0].startsWith('未实现的请求')) {
    //     return;
    // }
    const args = [...strs];
    const stack = new Error().stack!;
    let line = stack.split('\n')[3] || '';
    const pathMatch = line.match(/\(([^)]+)\)/);
    if (pathMatch) {
        const path = pathMatch[1];
        args.push('--', '\x1b[32m', path, '\x1b[0m');
    }
    return args;
}


export function log(...strs: any[]) {
    const args = _log(...strs);
    console.log(...args);
}

export function error(...strs: any[]) {
    const args = _log(...strs);
    console.error(...args);
}

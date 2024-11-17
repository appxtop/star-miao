import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export async function execCmd(command, args = []) {
    await new Promise((resolve, reject) => {
        const child = spawn(command, args, { shell: true, stdio: 'inherit' });
        child.on('exit', (code) => {
            if (code === 0) {
                resolve(code);
            } else {
                // 命令执行失败 
                reject(new Error(`命令执行失败退出 ${code}`));
            }
        });
        child.on('error', (error) => {
            reject(error);
        })
    });
}


/**
 * 获取packages下面所有项目的路径
 * @returns 
 */
export async function getPkgs() {
    const pkgPaths: string[] = [];
    const packagesDir = path.join(__dirname, '../packages');
    const packages = ['common', 'common-node', 'dbman', 'backend', 'client-web', 'launcher']
    const curPackages = await fs.readdir(packagesDir); // 使用fs.promises API 
    if ([...packages].sort().join() !== [...curPackages].sort().join()) {
        console.error('更改了新包请配置这里');
        throw new Error("更新了新包,请配置packages这个对象(修改代码)");
    }
    for (const pkg of packages) {
        const pkgPath = path.join(packagesDir, pkg);
        const stat = await fs.stat(pkgPath); // 使用fs.promises API  
        if (stat.isDirectory()) {
            pkgPaths.push(pkgPath);
        }
    }
    return pkgPaths;
}


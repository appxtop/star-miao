import fs from 'fs/promises';
import path from 'path';
import { getPkgs } from './common';

//删除每个项目下面的dist文件夹
(async () => {
    const pkgs = await getPkgs();
    for (const pkg of pkgs) {
        const fullPath = path.join(pkg, 'dist');
        try {
            console.log('===================================');
            console.log(`删除目录:${fullPath}`);
            await fs.rm(fullPath, { recursive: true, force: true });
            console.log("ok");
        } catch (err) {
            console.error(`删除目录失败: ${err.message}`);
        }
    }
})();


import { execCmd, getPkgs } from './common';
console.log('不要胡乱使用');
//更新软件包的,一般不建议使用需要安装 npm install -g npm-check-updates
(async () => {
    const pkgs = await getPkgs();
    for (const pkg of pkgs) {
        const cmdStr = `cd ${pkg} && ncu -u`;
        console.log('==============================================');
        console.log(`执行命令:${cmdStr}`);;
        await execCmd(cmdStr);
    }
})();

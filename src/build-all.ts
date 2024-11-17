import { execCmd, getPkgs } from './common';
//cd到packages下面的每个项目并执行其中的npm run build
(async () => {
    const pkgs = await getPkgs();
    for (const pkg of pkgs) {
        const cmdStr = `cd ${pkg} && npm run build`;
        console.log('==============================================');
        console.log(`执行命令:${cmdStr}`);;
        await execCmd(cmdStr);
    }
})();

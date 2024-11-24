import { startMainServer } from "..";
import { connectAll } from '@mono/dbman';
(async () => {
    //#TODO 暂时先全部连接
    await connectAll();
    await startMainServer();
})();


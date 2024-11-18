import dotenv from 'dotenv';
import path from 'path';
let init = false;
function initConfig() {
    const _path = path.resolve(__dirname, '../../../.env');
    console.log('加载配置文件', _path);
    const result = dotenv.config({
        path: _path
    });
    if (result.error) {
        throw new Error(`无法加载环境变量文件: ${result.error.message}`);
    }
}

type ConfigName =
    | 'REDIS_URL'
    | 'MONGO_URL'
    | 'MONGO_DBNAME'
    | 'BACKEND_HOST'
    | 'BACKEND_PORT'
    | 'MAIL_HOST'
    | 'MAIL_PORT'
    | 'MAIL_USER'
    | 'MAIL_PASS'
    | 'MAIL_FROM'
    ;
export function getConfig(name: ConfigName) {
    if (!init) {
        init = true;
        initConfig();
    }
    const val = process.env[name];
    if (!val) {
        switch (name) {
            case 'REDIS_URL':
                return 'redis://localhost:6379';
            case 'MONGO_URL':
                return 'mongodb://localhost:27017';
            case 'BACKEND_HOST':
                return '0.0.0.0'
            case 'BACKEND_PORT':
                return '1088';
            case 'MAIL_PORT':
                return '465';
        }
    }
    return val;
}
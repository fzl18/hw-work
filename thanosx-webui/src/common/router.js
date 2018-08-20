
import error404 from '../components/404';
import prohibit from '../components/prohibit';

export default [
    {
        path: '/prohibit',
        name: 'prohibit',
        component: prohibit
    },
    {
        path: '*',
        name: 'error404',
        component: error404
    },
    
]

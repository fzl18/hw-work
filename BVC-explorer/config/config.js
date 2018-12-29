const config = {
    port: 3100,
    staticDir: './public',
    apiRoot: '/api',
    // cableServer: 'https://cable-hk.sdchain.io/v1',
    // chargerServer: 'https://charger.sdchain.io/sdchainCharger-webservice/rest',
    // dataAPIServer: 'https://data-api.sdchain.io/v2',
    cableServer: 'http://10.0.11.38:5990/v1',
    chargerServer: 'http://10.0.12.52:8080/sdchainCharger-webservice/rest',
    dataAPIServer: 'http://10.0.11.37:3000/v2',
    token:'12345',
    base:{
        drops:1000000,
        currency:'BVC'
    },
    tokenDetail:{
        currency:'CADT',
        issuer:'b3dTws3ShReaHefvkXvT4sn5L7z26SRMky',
        image:'http://bvcfile.hwelltech.net:88/charger/6fda9cc6-4a7d-4ba5-b548-fa3f0ae81685.png',
        total:200000000000000,
        lang:'cn',
        desc:{
            cn:'BVC是一家金融服务公司，受加拿大金融服务部监管，具有丰富的法定和数字资产中介经验。 CADT是BVC发行的数字资产，与加元等值。使用BVC在区块链上清算和结算任何数字交易，即使在传统银行营业时间之外，也可以将资产转换回等值的法币。您将始终能够在一个工作日内兑换成交。每个令牌始终一对一支持，传统货币保留在我们的储备中。 所以1CADT总是相当于1加元。我们的储备每日发布。 流通中的所有代币总是与我们的储备相匹配。以加元等值面额清算和结算数字资产交易的现金部分。',
            en:'BVC is a financial services company regulated by the Canadian Financial Services Department and has extensive legal and digital asset brokering experience. CADT is a digital asset issued by BVC, equivalent to the Canadian dollar. Use BVC to clear and settle any digital transactions on the blockchain, even in the traditional banking hours, to convert the assets back to the equivalent of the legal currency. You will always be able to redeem your trade within one weekday. Each token is always supported one-on-one, and traditional currency is kept in our reserves. So 1 CADT is always equivalent to 1 Canadian dollar. Our reserves are released daily. All tokens in circulation always match our reserves. Clear and settle the cash portion of digital asset transactions in Canadian dollar equivalent denominations.',
            fr:'BVC est une société de services financiers réglementée par le Département des services financiers canadien et possède une vaste expérience en courtage d\'actifs juridiques et numériques. La CADT est un actif numérique émis par BVC, équivalent au dollar canadien. Utilisez BVC pour effacer et régler toutes les transactions numériques sur la blockchain, même pendant les heures ouvrables traditionnelles, afin de reconvertir les actifs en équivalent de la devise légale. Vous pourrez toujours échanger votre transaction en un jour ouvrable. Chaque jeton est toujours pris en charge individuellement et la devise traditionnelle est conservée dans nos réserves. Donc, 1 CADT équivaut toujours à 1 dollar canadien. Nos réserves sont libérées quotidiennement. Tous les jetons en circulation correspondent toujours à nos réserves. Effacer et régler la partie en espèces des transactions d’actifs numériques en libellés en dollars canadiens.'
        }
    },
    logger: {
        common: {
            level: 'debug',
            maxFiles: 100,
            maxsize: 1000 * 1000 * 10,
            json: false,
            dirname: process.cwd() + '/logs',
            filename: 'app.log',
            timestamp: function () {
                var nowDate = new Date();
                var result = nowDate.toLocaleDateString() + " " + nowDate.toLocaleTimeString();
                return result;
            },
            formatter: function (options) {
                return options.timestamp() + ' [' + options.level.toUpperCase() + ']: ' + options.message;
            }
        }
    }
};
module.exports = config;
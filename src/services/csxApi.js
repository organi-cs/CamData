// src/services/csxApi.js
/**
 * Cambodia Securities Exchange (CSX) Data Service
 * 
 * NOTE: CSX has no public API. This service provides:
 * 1. Static demo data for development
 * 2. Structure for future web scraping integration
 * 
 * CSX Website: https://csx.com.kh
 */

/**
 * All stocks currently listed on the Cambodia Securities Exchange
 */
export const CSX_STOCKS = [
    { symbol: 'PWSA', name: 'Phnom Penh Water Supply Authority', nameKm: 'រដ្ឋាករទឹកស្វយ័តក្រុងភ្នំពេញ', sector: 'Utilities' },
    { symbol: 'GTI', name: 'Grand Twins International', nameKm: 'ក្រុមហ៊ុន ហ្គ្រេន ធ្វីន អ៊ីនធើណេសិនណល', sector: 'Textiles' },
    { symbol: 'PPAP', name: 'Phnom Penh Autonomous Port', nameKm: 'កំពង់ផែស្វយ័តភ្នំពេញ', sector: 'Transportation' },
    { symbol: 'PPSP', name: 'Phnom Penh SEZ', nameKm: 'តំបន់សេដ្ឋកិច្ចពិសេសភ្នំពេញ', sector: 'Real Estate' },
    { symbol: 'ABC', name: 'Acleda Bank Cambodia', nameKm: 'ធនាគារ អេស៊ីលីដា កម្ពុជា', sector: 'Banking' },
    { symbol: 'MJQE', name: 'Chip Mong Insee Cement', nameKm: 'ស៊ីម៉ងត៍ ឈីប ម៉ុង អាំងសេ', sector: 'Construction' },
    { symbol: 'PEPC', name: 'Pestech Cambodia', nameKm: 'ភេសតិច កម្ពុជា', sector: 'Energy' },
    { symbol: 'CGSM', name: 'Cambo Greenergy', nameKm: 'កំបូ ហ្គ្រីនអ៊ីនើជី', sector: 'Energy' },
    { symbol: 'JSL', name: 'JS Land', nameKm: 'ជេអេស ឡែន', sector: 'Real Estate' },
    { symbol: 'DBD', name: 'DBD Engineering', nameKm: 'ឌីប៊ីឌី អ៊ិនជីនារីង', sector: 'Engineering' },
];

/**
 * Static market data - Update daily via CRON job in production
 * Last updated: 2026-02-08
 */
const MARKET_DATA = {
    lastUpdated: '2026-02-08T16:00:00+07:00',
    index: {
        value: 481.25,
        change: +2.15,
        changePercent: +0.45,
        volume: 125400,
        value_khr: 512500000,
    },
    stocks: [
        { symbol: 'PWSA', price: 6200, open: 6150, high: 6250, low: 6100, change: +50, changePercent: +0.81, volume: 12500 },
        { symbol: 'GTI', price: 3150, open: 3170, high: 3200, low: 3120, change: -20, changePercent: -0.63, volume: 8400 },
        { symbol: 'PPAP', price: 2850, open: 2835, high: 2880, low: 2820, change: +15, changePercent: +0.53, volume: 5200 },
        { symbol: 'PPSP', price: 1950, open: 1950, high: 1980, low: 1930, change: 0, changePercent: 0, volume: 3100 },
        { symbol: 'ABC', price: 15200, open: 15080, high: 15350, low: 15000, change: +120, changePercent: +0.80, volume: 22000 },
        { symbol: 'MJQE', price: 2100, open: 2110, high: 2150, low: 2080, change: -10, changePercent: -0.47, volume: 4800 },
        { symbol: 'PEPC', price: 1850, open: 1830, high: 1870, low: 1820, change: +20, changePercent: +1.09, volume: 6200 },
        { symbol: 'CGSM', price: 980, open: 975, high: 995, low: 970, change: +5, changePercent: +0.51, volume: 2800 },
        { symbol: 'JSL', price: 1420, open: 1400, high: 1450, low: 1390, change: +20, changePercent: +1.43, volume: 3500 },
        { symbol: 'DBD', price: 2650, open: 2680, high: 2720, low: 2630, change: -30, changePercent: -1.12, volume: 4100 },
    ],
};

/**
 * Get CSX market index data
 */
export function getCSXIndex() {
    return {
        ...MARKET_DATA.index,
        lastUpdated: MARKET_DATA.lastUpdated,
    };
}

/**
 * Get all CSX stock prices
 */
export function getCSXStocks() {
    return MARKET_DATA.stocks.map(stock => {
        const info = CSX_STOCKS.find(s => s.symbol === stock.symbol);
        return {
            ...stock,
            name: info?.name || stock.symbol,
            nameKm: info?.nameKm || stock.symbol,
            sector: info?.sector || 'Unknown',
        };
    });
}

/**
 * Get single stock data by symbol
 */
export function getCSXStock(symbol) {
    const stock = MARKET_DATA.stocks.find(s => s.symbol === symbol.toUpperCase());
    if (!stock) return null;

    const info = CSX_STOCKS.find(s => s.symbol === symbol.toUpperCase());
    return {
        ...stock,
        name: info?.name || symbol,
        nameKm: info?.nameKm || symbol,
        sector: info?.sector || 'Unknown',
        lastUpdated: MARKET_DATA.lastUpdated,
    };
}

/**
 * Get trade summary (total market activity)
 */
export function getCSXTradeSummary() {
    const stocks = MARKET_DATA.stocks;
    const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);
    const gainers = stocks.filter(s => s.change > 0).length;
    const losers = stocks.filter(s => s.change < 0).length;
    const unchanged = stocks.filter(s => s.change === 0).length;

    return {
        totalVolume,
        totalTrades: stocks.length,
        gainers,
        losers,
        unchanged,
        topGainer: stocks.reduce((a, b) => (a.changePercent > b.changePercent ? a : b)),
        topLoser: stocks.reduce((a, b) => (a.changePercent < b.changePercent ? a : b)),
        mostActive: stocks.reduce((a, b) => (a.volume > b.volume ? a : b)),
        lastUpdated: MARKET_DATA.lastUpdated,
    };
}

/**
 * Get stocks by sector
 */
export function getCSXStocksBySector(sector) {
    return getCSXStocks().filter(s => s.sector.toLowerCase() === sector.toLowerCase());
}

/**
 * Get all available sectors
 */
export function getCSXSectors() {
    return [...new Set(CSX_STOCKS.map(s => s.sector))];
}

export default {
    getCSXIndex,
    getCSXStocks,
    getCSXStock,
    getCSXTradeSummary,
    getCSXStocksBySector,
    getCSXSectors,
    CSX_STOCKS,
};

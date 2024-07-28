const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;



function getPagination(query)
{
    const page = Math.abs(Number(query.page)) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(Number(query.limit)) || DEFAULT_PAGE_LIMIT;

    const limitVal = limit;
    const skipVal = limitVal * (page -1);

    return {
        limitVal,
        skipVal,
    };
}


module.exports = 
{
    getPagination,
};
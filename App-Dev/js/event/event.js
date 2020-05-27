const systemEvents = {
    "EVENT_FETCHED_PRODUCTS" : "got-product-list",
    "EVENT_FETCHED_COMMANDS" : "got-command-list",
    "EVENT_FETCHED_CATEGORIES" : "got-category-list",
    "EVENT_CART_UPDATED" : "update-cart",
    "EVENT_USER_AUTHENTIFY" : "user-authentify",
    "EVENT_UPDATE_AUTHENTIFY" : "update-authentify",
    "EVENT_USER_REGISTER" : "user-register"
}
const displayEvents = {
    "EVENT_ADD_PRODUCT_TO_CART" : "add-product-to-cart",
    "EVENT_FILTER_PRODUCT_BY_CATEGORY" : "filter-product-by-category",
    "EVENT_SETUP" : "setup",
    "EVENT_INIT_CART" : "init-cart",

}

export default {
    systemEvents: systemEvents,
    displayEvents: displayEvents,
};

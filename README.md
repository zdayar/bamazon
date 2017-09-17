# bamazon

## Description of the 2 Node applications

The video recording of both apps is in the file `bamazon.mov`.

### #1: Customer View (bamazonCustomer.js)

Running this as `node bamazon.js` displays all of the items available for sale and allows the user to purchase items by entering an item id and quantity. 

If the store has enough of the product to meet the customer's request, the order is processed and the user sees how much the total cost is. If there is not enough quantity in stock, the customer sees a message saying so. 

### #2: Manager View (bamazonManager.js)

Running this application as `node bamazonManager.js` will allow the manager to perform one of the following actions:

    * View Products for Sale    
    * View Low Inventory
    * Add to Inventory
    * Add New Product

  * If a manager selects `View Products for Sale`, the app lists every available item.

  * If a manager selects `View Low Inventory`, then it lists all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, the app displays a prompt that will let the manager "add more" of any item currently in the store by selecting the item id and quantity to add. 

  * If a manager selects `Add New Product`, it allows the manager to add a completely new product to the store.

- - -

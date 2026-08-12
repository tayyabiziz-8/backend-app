let products = [
    {
        id: 1,
        name: "Product 1",
        price: 10.99,
        description: "Description for Product 1"
    },
    {
        id: 2,
        name: "Product 2",
        price: 15.99,
        description: "Description for Product 2"
    }
]

export const getProducts = (req, res) => {
    res.json(products);
}
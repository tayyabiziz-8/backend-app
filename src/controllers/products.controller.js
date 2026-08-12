const products = [
    {
      id: 1,
      name: "Laptop",
      price: 1200,
    },
    {
      id: 2,
      name: "Phone",
      price: 800,
    },
    {
      id: 3,
      name: "Headphones",
      price: 150,
    },
];
export const getProducts = (req, res) => {
  res.status(200).json(products);
};
export const getProduct = (req, res) => {
  const { id } = req.params;
  const product = products.find(
    (product) => product.id === Number(id)
  );

  if (!product) {
    return res.status(404).json({
      message: `Product with id: ${id} not found`,
    });
  }
  res.status(200).json(product);
};
export const createProduct = (req, res) => {
  const { name, price } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const product = products.find(
    (product) => product.id === Number(id)
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  product.name = name;
  product.price = price;
  res.status(200).json(product);
};
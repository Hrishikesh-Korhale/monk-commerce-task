import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Box, Button, Typography } from "@mui/material";

import ProductPickerDialog from "./ProductPicker";

import Product from "./Product";

const ProductList = () => {
  const newProduct = {
    instanceId: new Date().getTime() + Math.random(),
    id: null,
    title: "",
    variants: [],
    discount: 0,
    discountType: "Percentage",
    showDiscountFields: false,
    showVariants: false,
  };
  const [products, setProducts] = useState([newProduct]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [editingInstanceId, setEditingInstanceId] = useState(null);

  const handleCloseDialog = () => setDialogOpen(false);

  const handleEditProduct = (instanceId) => {
    setEditingInstanceId(instanceId);
    setDialogOpen(true);
  };

  const handleAddEmptyItem = () => {
    setProducts((prevProducts) => {
      return [...prevProducts, newProduct];
    });
    console.log("Products length:", products.length); // Check the length
  };

  const handleAddItems = (items) => {
    const newProducts = Object.keys(items).map((productId) => {
      const selectedProduct = items[productId];
      const selectedVariants = selectedProduct.variants
        .filter((variant) => variant.selected)
        .map((variant) => ({
          id: variant.id,
          title: variant.title,
          inventory_quantity: variant.inventory_quantity,
          price: variant.price,
        }));

      return {
        instanceId: new Date().getTime() + Math.random(), // Unique ID for each instance
        id: productId,
        title: selectedProduct.title,
        variants: selectedVariants,
        discount: 0,
        discountType: "Percentage",
        showDiscountFields: false,
        showVariants: false,
      };
    });

    setProducts((prevProducts) => {
      // Find the index of the product being edited
      const editingIndex = prevProducts.findIndex(
        (product) => product.instanceId === editingInstanceId
      );

      // Clone the current list of products
      const updatedProducts = [...prevProducts];

      if (editingIndex !== -1) {
        // Replace the product at the original position with new products
        updatedProducts.splice(editingIndex, 1, ...newProducts);
      } else {
        // If no editing, just add the new products at the end
        updatedProducts.push(...newProducts);
      }

      return updatedProducts;
    });

    setSelectedProducts({});
    setEditingInstanceId(null); // Reset editing state
    setDialogOpen(false);
  };

  const handleRemoveProduct = (instanceId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.instanceId !== instanceId)
    );
  };

  useEffect(() => {
    console.log(products);
  }, [products]);

  const toggleDiscountFields = (instanceId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.instanceId === instanceId
          ? { ...product, showDiscountFields: !product.showDiscountFields }
          : product
      )
    );
  };

  const applyDiscount = (productId, discountValue) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, discount: discountValue }
          : product
      )
    );
  };

  const changeDiscountType = (productId, discountType) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, discountType } : product
      )
    );
  };

  const toggleVariants = (instanceId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.instanceId === instanceId
          ? { ...product, showVariants: !product.showVariants }
          : product
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedProducts = Array.from(products);
    const [moved] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, moved);
    setProducts(reorderedProducts);
  };

  return (
    <Box sx={{ p: 2, maxWidth: "800px" }}>
      <Typography variant="h6">Add Products</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="group">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {products.map((product, index) => (
                <Product
                  key={index}
                  index={index}
                  product={product}
                  products={products}
                  setProducts={setProducts}
                  handleEditProduct={handleEditProduct}
                  toggleDiscountFields={toggleDiscountFields}
                  handleRemoveProduct={handleRemoveProduct}
                  applyDiscount={applyDiscount}
                  changeDiscountType={changeDiscountType}
                  toggleVariants={toggleVariants}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => handleAddEmptyItem()}
          sx={{
            borderColor: "#007555",
            color: "#007555",
            textTransform: "none",
            minWidth: "250px",
          }}
        >
          Add Product
        </Button>
      </Box>

      <ProductPickerDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddItems}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    </Box>
  );
};

export default ProductList;

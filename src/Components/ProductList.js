import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ProductPickerDialog from "./ProductPicker";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

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

    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setSelectedProducts({});
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
    <Box sx={{ p: 2, maxWidth: "50%" }}>
      <Typography variant="h6">Add Products</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="group">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {products.map((product, index) => (
                <Draggable
                  key={index}
                  draggableId={index.toString()}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        mb: 2,
                        p: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <IconButton {...provided.dragHandleProps}>
                          <DragIndicatorIcon />
                        </IconButton>
                        <Typography>{index + 1}.</Typography>
                        <TextField
                          variant="outlined"
                          placeholder="Product Name"
                          size="small"
                          value={product.title}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog()}
                                >
                                  <EditIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        {product.showDiscountFields ? (
                          <>
                            <TextField
                              variant="outlined"
                              label="Discount"
                              size="small"
                              type="number"
                              value={product.discount}
                              onChange={(e) =>
                                applyDiscount(product.id, e.target.value)
                              }
                            />
                            <Select
                              variant="outlined"
                              size="small"
                              value={product.discountType}
                              onChange={(e) =>
                                changeDiscountType(product.id, e.target.value)
                              }
                            >
                              <MenuItem value="Percentage">Percentage</MenuItem>
                              <MenuItem value="Fixed">Flat</MenuItem>
                            </Select>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            sx={{
                              textTransform: "none",
                              fontWeight: 550,
                              backgroundColor: "#007555",
                            }}
                            onClick={() =>
                              toggleDiscountFields(product.instanceId)
                            }
                          >
                            Add Discount
                          </Button>
                        )}
                        <IconButton
                          onClick={() =>
                            handleRemoveProduct(product.instanceId)
                          }
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      {product.variants.length > 1 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                          }}
                        >
                          <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            size="small"
                            onClick={() => toggleVariants(product.instanceId)}
                            startIcon={
                              product.showVariants ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )
                            }
                          >
                            {product.showVariants
                              ? "Hide Variants"
                              : "Show Variants"}
                          </Button>
                        </Box>
                      )}

                      {product.showVariants && (
                        <Box sx={{ mt: 1, ml: 5 }}>
                          {product.variants.map((variant) => (
                            <Box
                              key={variant.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mt: 1,
                              }}
                            >
                              <IconButton>
                                <DragIndicatorIcon />
                              </IconButton>
                              <TextField
                                value={variant.title}
                                size="small"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "20px", // Apply 20px border radius
                                  },
                                }}
                              />

                              <IconButton>
                                <CloseIcon />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  )}
                </Draggable>
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
          onClick={handleOpenDialog}
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

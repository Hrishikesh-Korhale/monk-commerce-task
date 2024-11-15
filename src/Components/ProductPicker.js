import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Button,
  Typography,
  Divider,
  IconButton,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const ProductPickerDialog = ({
  open,
  onClose,
  onAdd,
  selectedProducts,
  setSelectedProducts,
}) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  useEffect(() => {
    fetchProducts();
    console.log(products);
  }, [searchTerm]);

  const handleToggleProduct = (productId) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = !!prevSelected[productId];
      const product = products.find((p) => p.id === productId);

      if (isSelected) {
        const { [productId]: removed, ...rest } = prevSelected;
        return rest;
      } else {
        return {
          ...prevSelected,
          [productId]: {
            ...product,
            variants: product.variants.map((variant) => ({
              ...variant,
              selected: true,
            })),
          },
        };
      }
    });
  };

  const handleToggleVariant = (productId, variantId) => {
    setSelectedProducts((prevSelected) => {
      const product =
        prevSelected[productId] || products.find((p) => p.id === productId);
      const newVariants = product.variants.map((variant) =>
        variant.id === variantId
          ? { ...variant, selected: !variant.selected }
          : variant
      );

      const hasSelectedVariants = newVariants.some(
        (variant) => variant.selected
      );

      return {
        ...prevSelected,
        [productId]: hasSelectedVariants
          ? { ...product, variants: newVariants }
          : undefined,
      };
    });
  };

  const fetchProducts = async (search = searchTerm, page = 1, limit = 5) => {
    setLoading(true);
    const apiKey = process.env.REACT_APP_API_KEY;

    try {
      const response = await axios.get(
        `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=${limit}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle>Select Products</DialogTitle>
        <Box>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "#000000CC" }} />
          </IconButton>
        </Box>
      </Box>
      <DialogContent dividers>
        <TextField
          placeholder="Search product"
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Divider />
        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 2, my: 10 }}
          >
            <CircularProgress sx={{ color: "#007555" }} />
          </Box>
        ) : products == null ? (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No products found. Please try a different search.
            </Typography>
          </Box>
        ) : (
          <List>
            {products &&
              products.map((product) => (
                <React.Fragment key={product.id}>
                  <ListItem
                    button
                    onClick={() => handleToggleProduct(product.id)}
                    sx={{ pl: 0 }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={!!selectedProducts[product.id]}
                        tabIndex={-1}
                        disableRipple
                        sx={{
                          color: "#008060",
                          "&.Mui-checked": {
                            color: "#008060",
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar src={product.image.src} alt={product.title} />
                    </ListItemAvatar>
                    <ListItemText primary={product.title} />
                  </ListItem>
                  <Divider />
                  {product.variants.map((variant) => (
                    <ListItem
                      key={variant.id}
                      button
                      sx={{ pl: 6 }}
                      onClick={() =>
                        handleToggleVariant(product.id, variant.id)
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={
                            !!selectedProducts[product.id]?.variants.find(
                              (v) => v.id === variant.id
                            )?.selected
                          }
                          tabIndex={-1}
                          disableRipple
                          sx={{
                            color: "#008060",
                            "&.Mui-checked": {
                              color: "#008060",
                            },
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Typography sx={{ textAlign: "left" }}>
                              {variant.title}
                            </Typography>
                            <Typography sx={{ textAlign: "right" }}>
                              {variant.inventory_quantity} available{" "}
                              <span style={{ marginLeft: "8px" }}> </span>$
                              {variant.price}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </React.Fragment>
              ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Typography sx={{ flexGrow: 1, pl: 2 }}>
          {
            Object.keys(selectedProducts).filter(
              (productId) => selectedProducts[productId]
            ).length
          }{" "}
          product(s) selected
        </Typography>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "grey.600",
            borderColor: "grey.400",
            "&:hover": {
              backgroundColor: "grey.100",
              borderColor: "grey.600",
            },
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={() => onAdd(selectedProducts)}
          sx={{
            backgroundColor: "#007555",
            minWidth: "100px",
            textTransform: "none",
          }}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductPickerDialog;

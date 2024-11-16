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
  Skeleton,
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (open) {
      setProducts([]); // Reset products on dialog open
      setPage(1); // Reset page
      setHasMore(true); // Reset hasMore
      fetchProducts(searchTerm, 1);
    }
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(searchTerm, page);
    }
    // eslint-disable-next-line
  }, [page]);

  const fetchProducts = async (
    search = searchTerm,
    currentPage = page,
    limit = 10
  ) => {
    if (!hasMore || loadingMore) return;

    currentPage === 1 ? setLoading(true) : setLoadingMore(true);

    const apiKey = process.env.REACT_APP_API_KEY;

    try {
      const response = await axios.get(
        `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${currentPage}&limit=${limit}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (response.data.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...response.data]);
        setHasMore(response.data.length === limit); // Check if there's more data
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      currentPage === 1 ? setLoading(false) : setLoadingMore(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    // Check if scrolled to 80% of the dialog content
    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      hasMore &&
      !loadingMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle>Select Products</DialogTitle>
        <Box>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: "#000000CC" }} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent dividers onScroll={handleScroll}>
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
        ) : (
          <List>
            {products.map((product) => (
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
                    {/* <Avatar
                      alt={product.title}
                      src={product.image.src}
                      loading="lazy"
                      sx={{ width: 40, height: 40 }}
                    /> */}
                    <ListItemAvatar>
                      <Avatar>{product.title?.charAt(0).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                  </ListItemAvatar>

                  <ListItemText primary={product.title} />
                </ListItem>
                <Divider />
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <ListItem
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
                              <span style={{ marginLeft: "8px" }} />$
                              {variant.price}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </React.Fragment>
            ))}
            {loadingMore && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <Skeleton width="100%" height={80} animation="wave" />
                <Skeleton width="100%" height={80} animation="wave" />
              </Box>
            )}
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
          onClick={handleClose}
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

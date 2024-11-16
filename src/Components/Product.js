import React from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Draggable } from "react-beautiful-dnd";
import Variants from "./Variants";

const Product = ({
  product,
  products,
  setProducts,
  index,
  handleEditProduct,
  toggleDiscountFields,
  handleRemoveProduct,
  applyDiscount,
  changeDiscountType,
  toggleVariants,
}) => {
  return (
    <Draggable draggableId={index.toString()} index={index} type="group">
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps} // Applying draggableProps to the container
          sx={{
            mb: 2,
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Only the drag handle (the icon) should be draggable */}
            <IconButton {...provided.dragHandleProps} sx={{cursor: 'grab'}}>
              <DragIndicatorIcon />
            </IconButton>
            <Typography>{index + 1}.</Typography>
            <TextField
              variant="outlined"
              placeholder="Select Product"
              size="small"
              value={product.title}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleEditProduct(product.instanceId)}
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
                  onChange={(e) => applyDiscount(product.id, e.target.value)}
                />
                <Select
                  variant="outlined"
                  size="small"
                  value={product.discountType}
                  onChange={(e) =>
                    changeDiscountType(product.id, e.target.value)
                  }
                >
                  <MenuItem value="Percentage">% Off</MenuItem>
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
                onClick={() => toggleDiscountFields(product.instanceId)}
              >
                Add Discount
              </Button>
            )}
            {products?.length > 1 && (
              <IconButton
                onClick={() => handleRemoveProduct(product.instanceId)}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          {product.variants.length > 1 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="text"
                sx={{ textTransform: "none" }}
                size="small"
                onClick={() => toggleVariants(product.instanceId)}
                startIcon={
                  product.showVariants ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
              >
                {product.showVariants ? "Hide Variants" : "Show Variants"}
              </Button>
            </Box>
          )}

          <Variants product={product} setProducts={setProducts} />
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}
    </Draggable>
  );
};

export default Product;

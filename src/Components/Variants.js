import React from "react";
// import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, IconButton, TextField, MenuItem, Select } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Variants = ({ product, setProducts }) => {
  // Function to handle updates to a specific variant
  const onUpdateVariant = (variantId, updatedData) => {
    const updatedVariants = product.variants.map((variant) =>
      variant.id === variantId
        ? { ...variant, ...updatedData }
        : variant
    );

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, variants: updatedVariants } : p
      )
    );
  };

  // Function to remove a variant
  const onRemoveVariant = (variantId) => {
    const updatedVariants = product.variants.filter(
      (variant) => variant.id !== variantId
    );

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, variants: updatedVariants } : p
      )
    );
  };

  return (
    product?.showVariants && (
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
            {/* <IconButton>
              <DragIndicatorIcon />
            </IconButton> */}
            <TextField
              value={variant.title}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
              onChange={(e) =>
                onUpdateVariant(variant.id, { title: e.target.value })
              }
            />
            <TextField
              value={variant.discount || 0} // Default discount is set to 0
              size="small"
              type="number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  maxWidth: "100px",
                },
              }}
              onChange={(e) =>
                onUpdateVariant(variant.id, { discount: e.target.value || 0 }) // Ensure discount is never empty or invalid
              }
            />
            <Select
              value={variant.discountType || "Percentage"} // Default discount type is 'Percentage'
              size="small"
              onChange={(e) =>
                onUpdateVariant(variant.id, { discountType: e.target.value })
              }
              sx={{
                minWidth: "100px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "20px",
                },
              }}
            >
              <MenuItem value="Percentage">% Off</MenuItem>
              <MenuItem value="Fixed">Flat</MenuItem>
            </Select>

            <IconButton onClick={() => onRemoveVariant(variant.id)}>
              <CloseIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    )
  );
};

export default Variants;

import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import NFTGallery from "components/NFTGallery/NFTGallery";
import { IContractInit, useZilpay } from "contexts/ZilContext/ZilContext";
import React, { useState } from "react";
import { useCallback } from "react";
import { FaCross, FaPlus } from "react-icons/fa";
import { MdAdd, MdClose, MdHdrPlus, MdInfo } from "react-icons/md";
import { toast } from "react-toastify";
import { theme } from "theme";

type Props = {};

const NFTListPage = (props: Props) => {
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [addNFTAddress, setAddNFTAddress] = useState("");

  const { zilPay, userNFTs, setUserNFTs } = useZilpay();

  const handleButtonClick = useCallback(async () => {
    if (addFieldOpen) {
      if (!addNFTAddress) return;
      const contract = zilPay.contracts.at(addNFTAddress);
      const state = await contract.getState();
      const init = await contract.getInit();
      const initObj: any = {};
      init.forEach((param: any) => {
        initObj[param.vname] = param.value;
      });
      const { _this_address: address, ...rest } = initObj;
      if (userNFTs && address in userNFTs) {
        toast("This NFT has already been added.");
      }
      setUserNFTs((userNFTS: any) => ({ ...userNFTs, [address]: rest }));
    } else {
      setAddFieldOpen(true);
    }
  }, [addFieldOpen, addNFTAddress, userNFTs, setUserNFTs]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="1rem 0"
        borderBottom="3px solid lightGrey"
        marginBottom="2rem"
      >
        <Typography
          color="text.primary"
          fontWeight="bold"
          component="div"
          variant="h4"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          Your NFTs
          <Box display="flex" alignItems="center">
            <MdInfo
              style={{
                marginRight: "0.25rem",
              }}
              color={theme.palette.primary.main}
              size="1rem"
            />
            <Typography fontSize="0.75rem">
              Click on a token to approve it for deposit. Click on an approved
              token to deposit and link it.
            </Typography>
          </Box>
        </Typography>
        <Box display="flex" alignItems="center">
          <Tooltip title="Add New NFT" placement="bottom">
            <Button
              //   startIcon={}
              sx={{
                padding: "0.75rem 0.5rem",
                borderRadius: addFieldOpen ? "6px 0  0 6px" : "6px",
              }}
              variant="contained"
              onClick={handleButtonClick}
            >
              <MdAdd size="1.25rem" />
              {/* {addFieldOpen ? "" : "Add an NFT"} */}
            </Button>
          </Tooltip>
          <Collapse
            orientation="horizontal"
            collapsedSize={0}
            in={addFieldOpen}
          >
            <TextField
              placeholder="NFT Contract address"
              sx={{
                "& .MuiInputBase-root": {
                  height: "2.75rem",
                  borderRadius: "0 6px 6px 0",
                },
                "& .MuiInputBase-input": {
                  fontWeight: "bold",
                },
              }}
              value={addNFTAddress}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAddNFTAddress(event.target.value);
              }}
              onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key !== "Enter") return;
                handleButtonClick();
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      setAddNFTAddress("");
                      setAddFieldOpen(false);
                    }}
                  >
                    <MdClose size="1rem" />
                  </IconButton>
                ),
              }}
              variant="outlined"
            />
          </Collapse>
        </Box>
      </Box>
      {userNFTs ? (
        Object.keys(userNFTs).map((key: string) => {
          const metadata = userNFTs[key];
          return (
            <NFTGallery
              address={key}
              key={key}
              title={metadata.name}
              symbol={metadata.symbol}
            />
          );
        })
      ) : (
        <Typography>
          You haven't added any NFTs. Click the + button to begin.
        </Typography>
      )}
    </>
  );
};

export default NFTListPage;

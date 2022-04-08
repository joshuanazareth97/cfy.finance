import {
  Box,
  Button,
  Collapse,
  IconButton,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LIQUISHARE_ADDRESS } from "app_contsants";
import NFTCard from "components/NFTCard/NFTCard";
import NFTGallery from "components/NFTGallery/NFTGallery";
import { IContractInit, useZilpay } from "contexts/ZilContext/ZilContext";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { FaCross, FaPlus } from "react-icons/fa";
import { MdAdd, MdClose, MdHdrPlus, MdInfo } from "react-icons/md";
import { toast } from "react-toastify";
import { theme } from "theme";
import { transferFT, getFractionalised, checkRedeem } from "utils";

type Props = {};

interface IFracNFT {
  ft: string;
  id: string;
  tokens_needed: string;
  transferred: string;
  readyToRedeem: boolean;
  address: string;
  uri: string;
}

const RedeemListPage = (props: Props) => {
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [addNFTAddress, setAddNFTAddress] = useState("");

  const { zilPay, userNFTs, setUserNFTs } = useZilpay();
  const [contractState, setContractState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transacting, setTransacting] = useState(false);
  const [list, setList] = useState<IFracNFT[] | null>(null);

  const loadContract = useCallback(async () => {
    if (!zilPay) return;
    setLoading(true);
    const contract = zilPay.contracts.at(LIQUISHARE_ADDRESS);
    const state = await contract.getState();
    setContractState(state);
    setLoading(false);
  }, [zilPay, setContractState, setLoading]);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  const loadTokens = useCallback(async () => {
    if (!contractState || !zilPay) return;
    const fns = getFractionalised(contractState);
    const final: any = [];
    for (let key in fns) {
      const tokens = fns[key];
      const contract = zilPay.contracts.at(key);
      const nftState = await contract.getState();
      tokens.forEach((token: any) => {
        final.push({
          ...token,
          address: key,
          uri: nftState.token_uris[token.id],
        });
      });
    }
    setList(final);
  }, [contractState, zilPay, setList]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const handleTokenClick = useCallback(
    async (token: IFracNFT) => {
      try {
        setTransacting(true);
        const txPromise = token.readyToRedeem
          ? checkRedeem(zilPay, token.id, token.address, token.ft)
          : transferFT(zilPay, token.tokens_needed, token.ft);
        const res = await toast.promise(txPromise, {
          pending: token.readyToRedeem
            ? "Redeeming NFT..."
            : "Burning FTs to prepare NFT for redemption",
          success: "Success!",
          error: "There was an error",
        });
        console.log(res);
      } catch (err) {
        console.log(err);
      } finally {
        setTransacting(false);
        loadContract();
        loadTokens();
      }
    },
    [zilPay, loadTokens, setTransacting]
  );

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
          Fractionalised NFTs
          <Box display="flex" alignItems="center">
            <MdInfo
              style={{
                marginRight: "0.25rem",
              }}
              color={theme.palette.primary.main}
              size="1rem"
            />
            <Typography fontSize="0.75rem">
              Click on a fractionalised token to burn the related fungible
              tokens. Click on a ready token to redeem it.
            </Typography>
          </Box>
        </Typography>
      </Box>
      {loading ? (
        <LinearProgress />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
              // xl: "repeat(6, 1fr)",
            },
            gap: 6,
          }}
        >
          {list?.map((token) => {
            return (
              <NFTCard
                disabled={transacting}
                key={token.ft}
                onClick={() => handleTokenClick(token)}
                uri={token.uri}
                primaryText={
                  <Typography fontWeight="bold">Token #{token.id}</Typography>
                }
                secondaryText={
                  <Typography fontSize="0.75rem" fontWeight="bold">
                    {token.transferred} / {token.tokens_needed} deposited
                  </Typography>
                }
              />
            );
          })}
        </Box>
      )}
    </>
  );
};

export default RedeemListPage;

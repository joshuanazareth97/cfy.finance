import { MdOutlineGeneratingTokens } from "react-icons/md";
import logoImg from "assets/images/logo-1.png";
import { RiExchangeFundsFill } from "react-icons/ri";
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useZilpay } from "contexts/ZilContext/ZilContext";
import React, { useCallback, useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { truncateString } from "utils";
import { ToastContainer } from "react-toastify";

type Props = {
  children?: React.ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const { zilPay, setZilPay, error, setError, currentUser, setCurrentUser } =
    useZilpay();

  useEffect(() => {
    // @ts-ignore
    const windowZP = window.zilPay;
    setZilPay(windowZP);
  }, [setZilPay]);

  useEffect(() => {
    if (!zilPay) {
      return setInfoOpen(true);
    } else {
      setInfoOpen(false);
      handleWalletConnect();
    }
  }, [zilPay]);

  const handleWalletConnect = useCallback(async () => {
    if (!zilPay) {
      return setInfoOpen(true);
    }
    try {
      const conn = await zilPay.wallet.connect();
      if (conn) setCurrentUser(zilPay.wallet.defaultAccount);
    } catch (err: any) {
      setError(err);
    }
  }, [zilPay, setError, setCurrentUser]);

  return (
    <>
      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography
            color="white"
            fontWeight="bold"
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              "& img": {
                width: "10rem",
              },
            }}
          >
            <img src={logoImg} />
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexGrow: 1,
              "& > .MuiIconButton-root": {
                marginRight: "1rem",
                color: "white",
              },
            }}
          >
            <Tooltip title="Your NFTs" placement="bottom">
              <IconButton component={RouterLink} to="/nft">
                <MdOutlineGeneratingTokens />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redeem" placement="bottom">
              <IconButton component={RouterLink} to="/redeem">
                <RiExchangeFundsFill />
              </IconButton>
            </Tooltip>
            <Button
              sx={{
                borderRadius: "2rem",
                padding: "0.5rem 1rem",
              }}
              startIcon={<FaWallet size="1rem" />}
              color="secondary"
              variant="contained"
              onClick={
                currentUser
                  ? async () => {
                      //   await zilPay.wallet.disconnect();
                    }
                  : handleWalletConnect
              }
            >
              {(currentUser && truncateString(currentUser.base16)) ||
                "Connect Wallet"}
            </Button>
          </Box>
          {/* <IconButton></IconButton> */}
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          paddingTop: "3rem",
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children ?? <Outlet />}
      </Container>
      <Dialog open={infoOpen}>
        <DialogTitle>Add the Zilpay wallet extension</DialogTitle>
        <DialogContent>
          <Typography mb="1rem">
            It seems like you don't have the{" "}
            <a target=" __blank" href="https://zilpay.io/">
              Zilpay Wallet extension
            </a>{" "}
            installed in your browser.
          </Typography>
          <Typography mb="1rem">
            Once you have added the extension to your browser, connect your
            wallet using the button in the top right of the menu bar.
          </Typography>
          <Typography mb="1rem">
            This will allow you to trustlessly login and begin using the app.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setInfoOpen(false)}
            variant="contained"
            color="primary"
          >
            Got It!
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default DefaultLayout;

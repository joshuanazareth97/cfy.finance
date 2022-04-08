/*
Converts the message codes from the contract to a human-readable form.
*/

const messageCodes: any = {
  "1": {
    alert: "Successfully created user",
    name: "user_created",
    type: "success",
  },
  "2": { alert: "User already exists", name: "user_exists", type: "error" },
  "3": {
    alert: "User does not exist",
    name: "user_does_not_exist",
    type: "error",
  },
  "4": {
    alert: "Cannot update/claim commission as user is not owner",
    name: "user_is_not_owner",
    type: "error",
  },
  "5": {
    alert: "Commission claimed by owner",
    name: "commission_claimed",
    type: "success",
  },
  "6": {
    alert: "Commission updated by owner",
    name: "commission_updated",
    type: "success",
  },
  "11": {
    alert: "Successfully created listing",
    name: "listing_created",
    type: "success",
  },
  "12": {
    alert: "Successfully updated listing",
    name: "listing_updated",
    type: "success",
  },
  "13": {
    alert: "Successfully deleted listing",
    name: "listing_deleted",
    type: "success",
  },
  "14": {
    alert: "Successfully claimed rent from listing",
    name: "rent_claimed",
    type: "success",
  },
  "15": {
    alert: "No accumulated rent for listing being claimed",
    name: "rent_empty",
    type: "error",
  },
  "16": {
    alert: "Cannot delete listing as it has accumulated rent",
    name: "rent_not_empty",
    type: "error",
  },
  "17": {
    alert: "Cannot book listing because user is host",
    name: "user_is_host",
    type: "error",
  },
  "18": {
    alert: "Cannot manage listing because sender is not host",
    name: "user_is_not_host",
    type: "error",
  },
  "21": {
    alert: "Successfully booked listing",
    name: "listing_booked",
    type: "success",
  },
  "22": {
    alert: "Cannot book listing because it is rented",
    name: "listing_unavailable",
    type: "error",
  },
  "23": {
    alert: "Cannot create listing as user is a renter account",
    name: "user_is_renter",
    type: "error",
  },
  "24": {
    alert: "Cannot book listing as amount is wrong",
    name: "wrong_amount_sent",
    type: "error",
  },
  "25": {
    alert: "Cannot book listing because it does not exist",
    name: "listing_does_not_exist",
    type: "error",
  },
  "26": {
    alert: "Listing details are missing",
    name: "listing_details_missing",
    type: "error",
  },
};

const decodeMessage = (code: string) => {
  return messageCodes[code];
};

export const decodeZilPayError = (error: string) => {
  console.log(error);
  switch (error) {
    case "Insufficient funds in source account!":
      return "Insufficient funds for transaction";
    case "User rejected":
      return "Transaction rejected from ZilPay";
    default:
      return "ZilPay Error";
  }
};

export default decodeMessage;

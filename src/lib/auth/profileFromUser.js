import { getUserDisplayName } from "@/lib/auth/userDisplayName";

/**
 * @param {object | null | undefined} user
 */
export function getProfileFromUser(user) {
  const firstName =
    (typeof user?.first_name === "string" && user.first_name) ||
    (typeof user?.firstName === "string" && user.firstName) ||
    "";
  const lastName =
    (typeof user?.last_name === "string" && user.last_name) ||
    (typeof user?.lastName === "string" && user.lastName) ||
    "";
  const email = typeof user?.email === "string" ? user.email : "";
  const phone =
    (typeof user?.phone === "string" && user.phone) ||
    (typeof user?.mobile === "string" && user.mobile) ||
    "";
  const address =
    (typeof user?.address === "string" && user.address) ||
    (typeof user?.address_line === "string" && user.address_line) ||
    "";
  const postcode =
    (typeof user?.postcode === "string" && user.postcode) ||
    (typeof user?.post_code === "string" && user.post_code) ||
    "";

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    address: address.trim(),
    postcode: postcode.trim(),
    displayName: getUserDisplayName(user),
  };
}

/**
 * @param {string} displayName
 */
export function getProfileInitials(displayName) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "UE";
}

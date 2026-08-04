import { redirect } from "next/navigation";
import { NICEIC_APPROVED_PATH } from "@/data/niceicPages";

/** Old split URL → single combined page */
export default function NiceicCertificateRedirectPage() {
  redirect(`${NICEIC_APPROVED_PATH}#certificate`);
}

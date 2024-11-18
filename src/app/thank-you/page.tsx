import { Suspense } from "react";
import ThankYou from "./ThankYou";

const Page = ({
  searchParams: { orderId },
}: {
  searchParams: { orderId: string };
}) => {
  return (
    <Suspense>
      <ThankYou orderId={orderId || ""} />
    </Suspense>
  );
};

export default Page;

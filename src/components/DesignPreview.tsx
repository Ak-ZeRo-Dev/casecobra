"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import Phone from "./Phone";
import { Configuration } from "@prisma/client";
import { COLORS, FINISHES, MODELS } from "@/validator/option-validator";
import { cn, formatPrice } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "@/app/configure/preview/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoginModal from "./LoginModal";

type Props = {
  configuration: Configuration;
};

const items = [
  {
    label: "Highlights",
    list: [
      "Wireless charging compatible",
      "TPU shock absorption",
      "Packaging made from recycled materials",
      "5 year print warranty",
    ],
  },
  {
    label: "Materials",
    list: [
      "High-quality, durable material",
      "Scratch an fingerprint resistant coating",
    ],
  },
];

const DesignPreview = ({ configuration }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useKindeBrowserClient();

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true), []);

  const { id, color, croppedImageUrl, finish, material, model } = configuration;
  const tw = COLORS.find((c) => c.value === color)?.tw;
  const { label: modelLabel } = MODELS.options.find((m) => m.value === model)!;

  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      } else {
        throw new Error("Unable to retrieve payment URL");
      }
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description: "There was an error on our end, please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (user) {
      createPaymentSession({ configId: id });
    } else {
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
    }
  };
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")}
            imgSrc={croppedImageUrl!}
          />
        </div>
        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 md:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            {items.map((item) => (
              <div key={item.label}>
                <p className="font-medium text-zinc-950">{item.label}</p>
                <ol className="mt-3 text-zinc-700 list-disc list-inside">
                  {item.list.map((listItem) => (
                    <li key={listItem}>{listItem}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>

                {finish === "textured" && (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                )}

                {material === "polycarbonate" && (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                )}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex justify-between items-center py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button
                // disabled={isLoading}
                // isLoading={isLoading}
                loadingText="Loading"
                className="px-4 sm:px-6 lg:px-8"
                onClick={handleCheckout}
              >
                Checkout <ArrowRight className="w-4 h-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;

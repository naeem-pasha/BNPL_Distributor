// //////////////

import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RequestData } from "@/Pages/home";

export default function DeliveryAuthorization({
  data,
}: DeliveryAuthorizationProps & {
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="outline">Delivery Letter Issued</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg p-6 font-sans overflow-y-auto max-h-[90vh]">
        {/* Existing dialog content... */}
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-4">
            Delivery Authorization Notice
          </h1>
          <p className="text-right font-semibold text-gray-600">
            {data.updatedAt.split("T")[0]}
          </p>
        </div>

        {/* To Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">To,</h2>
          <div className="grid md:grid-cols-2 gap-4 border-b-2 pb-4">
            <div>
              <p className="font-semibold">Honda Atlas</p>
              <p className="text-gray-600">Karachi</p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold w-20">Attention:</span>
                <span>Mr. {data.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20">From:</span>
                <span>Meezan Bank Ltd.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 border-b-2 border-dashed pb-2">
            Authorization to Deliver the Bike
          </h3>
          <p className="text-gray-600 mb-4">
            It is to inform you that MBL, after purchasing a bike from Atlas,
            sold it to one of its customer. After reviewing the details
            mentioned below, kindly handover this bike to this customer.
          </p>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left border">Goods</th>
                <th className="p-3 text-left border">Quantity</th>
                <th className="p-3 text-left border">Engine No.</th>
                <th className="p-3 text-left border">Chassis No.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">
                  {data.bikeVarient}, {data.bikeColor}
                </td>
                <td className="p-3 border">01 Unit</td>
                <td className="p-3 border">{data.engineNo}</td>
                <td className="p-3 border">{data.chasisNo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buyer Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Buyer Name:</span>
              <span>Mr. {data.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Contact #:</span>
              <span>{data.phoneNo}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Buyer CNIC Number:</span>
              <span>{data.cnic}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Delivery Time Period:</span>
              <span> {data.deliveryDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-8 border-t-2 pt-4">
          <div className="text-right">
            <p className="text-lg font-bold text-gray-700">
              Meezan Bank Limited
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// TypeScript interface for props (add this if not already defined)
interface DeliveryAuthorizationProps {
  data: RequestData;
}

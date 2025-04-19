import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeliveryAuthorization from "@/components/ui/custom/AutherizationLetter";
import InvoiceLetter from "@/components/ui/custom/InvoiceLetter";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export interface RequestData {
  City: string;
  EmployID: string;
  bikeColor: string;
  bikeVarient: string;
  chasisNo: number;
  cnic: string;
  createdAt: string;
  distributerNo: string;
  email: string;
  engineNo: number;
  name: string;
  phoneNo: string;
  updatedAt: string;
  isSendAutherizedToUser: boolean;
  isSendInvoiceToUser: boolean;
  deliveryDate: string;
  isUserAcceptDelivery: boolean;
  isSendConfirmationTouser: boolean;
  _id: string;
  __v: number;
}

const MotorcycleDashboard = () => {
  const [data, setData] = useState<RequestData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 7;

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.City.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const apiURl = import.meta.env.VITE_DISTRIBUTER_URL;

  const getAllRequest = async () => {
    try {
      const { data } = await axios.get(`${apiURl}/api/allrequest`, {
        withCredentials: true,
      });
      if (data.success) {
        setData(data?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllRequest();
  }, []);

  const handleSendConfirmation = async (id: string) => {
    try {
      const result = await axios.put(
        `${
          import.meta.env.VITE_DISTRIBUTER_URL
        }/api/send-delivery-letter-to-user/${id}`
      );

      if (result.status === 200) {
        toast({
          title: "Success",
          description: "Successfully send offer to the customer.",
          variant: "default",
        });
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: "Unable to send the offer.",
          variant: "destructive",
        });
        console.error(
          "Error sending confirmation request:",
          error.response ? error.response.data : error.message
        );
      }

      alert("Failed to send confirmation request. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Distributer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage motorcycle listings and customer applications
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Container with better scroll handling */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Table with horizontal scroll containment */}
          <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider ">
                      Customer Name
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      CNIC
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Employ Id
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      City
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Bike Type
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Engine #
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Chassis #
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Update Status
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Delivered to Customer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((customer) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.cnic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.EmployID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phoneNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.City}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.bikeColor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.bikeVarient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.engineNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.chasisNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.isSendAutherizedToUser && (
                          <DeliveryAuthorization data={customer} />
                        )}
                        {/* {customer.isSendInvoiceToUser && (
                          <InvoiceLetter data={customer} />
                        )} */}
                      </td>

                      {customer.isSendInvoiceToUser &&
                        customer.isSendAutherizedToUser && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button
                              onClick={() =>
                                handleSendConfirmation(customer._id)
                              }
                              disabled={customer.isSendConfirmationTouser}
                              className="bg-green-800 hover:bg-green-800"
                            >
                              Delivery Confirmation Request
                            </Button>
                          </td>
                        )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.isUserAcceptDelivery && (
                          <p className="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                            DELIVERED
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scroll indicator - shows when table is scrollable */}
          <div className="hidden md:flex justify-center items-center py-2 text-sm text-gray-500 border-t border-gray-200">
            <span className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Scroll horizontally to see more
              <ChevronRight className="h-4 w-4 ml-1" />
            </span>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between ">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredData.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredData.length}</span>{" "}
                    results
                  </p>
                </div>

                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleDashboard;

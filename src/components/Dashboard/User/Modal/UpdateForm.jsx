import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import mapicon from "../../../../assets/map.json";
import useAuth from "@/Hooks/useAuth";
import MapLocation from "../MapLocation";
import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "@/Hooks/useAxiosSecure";

const UpdateForm = ({ parcel, refetch, closeUpdate }) => {
  const { user, setLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.displayName,
      email: user.email,
      latitude: parcel.latitude,
      longitude: parcel.longitude,
      weight: parcel.weight,
      price: parcel.price,
      phone: parcel.phone,
      type: parcel.type,
      address: parcel.address,
      reciverName: parcel.reciverName,
      reciverNumber: parcel.reciverNumber,
      reqDate: parcel.reqDate,
      bookingDate: parcel.bookingDate,
      status: parcel.status,
    },
  });
  const [latitude, setLatitude] = useState(parcel.latitude || null);
  const [longitude, setLongitude] = useState(parcel.longitude || null);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const calculatePrice = (weight) => {
    if (!weight || weight <= 0) {
      return 0;
    } else if (weight <= 1) {
      return 50;
    } else if (weight === 2) {
      return 100;
    } else {
      return 150;
    }
  };
  const handleWeightChange = (event) => {
    const weight = event.target.value;
    setValue("weight", weight);
    setValue("price", String(calculatePrice(Number(weight))));
  };
  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setValue("latitude", lat);
    setValue("longitude", lng);
    setShowMapDialog(false);
  };
  const { mutateAsync } = useMutation({
    mutationFn: async (parcelData) => {
      const { data } = await axiosSecure.patch(
        `/parcels/update/${parcel?._id}`,
        parcelData
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Parcel Updated Successfully!");
      navigate("/dashboard/my-parcel");
      closeUpdate();
      setLoading(false);
    },
  });
  const onSubmit = async (data) => {
    if (!latitude || !longitude) {
      toast.error("Please select a location on the map.");
      return;
    }
    if (parcel.status !== "Pending") {
      toast.error("You can only update parcels with 'Pending' status.");
      return;
    }
    try {
      const parcelData = {
        ...data,
        latitude: String(latitude),
        longitude: String(longitude),
        bookingDate: today,
        status: "Pending",
      };
      await mutateAsync(parcelData);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div className="md:flex  gap-10">
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Your Name
            </label>
            <input
              {...register("name")}
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Email address
            </label>
            <input
              {...register("email")}
              disabled
              type="email"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
        </div>
        <div className="md:flex gap-10">
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Your Number
            </label>
            <input
              {...register("phone", {
                required: "Phone Number is required",
                pattern: {
                  value: /^\+?[0-9]\d{10,10}$/,
                  message: "Phone number must only contain digits",
                },
              })}
              required
              type="tel"
              placeholder="+880****"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
            {errors.phone && (
              <span className="text-sm text-link">{errors.phone.message}</span>
            )}
          </div>
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Parcel Type
            </label>
            <input
              {...register("type")}
              required
              type="text"
              placeholder=" Type"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
        </div>
        <div className="md:flex gap-10">
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Parcel Weight(kg)
            </label>
            <input
              {...register("weight")}
              onChange={handleWeightChange}
              required
              min="1"
              maxLength="2"
              max="20"
              type="number"
              placeholder="**kg"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Delivery address
            </label>
            <input
              {...register("address")}
              required
              type="text"
              placeholder="Address"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
        </div>
        <div className="md:flex gap-10">
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Reciver Name
            </label>
            <input
              {...register("reciverName")}
              required
              type="text"
              placeholder="Reciver's Name"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Reciver Number
            </label>
            <input
              {...register("reciverNumber", {
                required: "Phone Number is required",
                pattern: {
                  value: /^\+?[0-9]\d{10,10}$/,
                  message: "Phone number must only contain digits",
                },
              })}
              required
              type="tel"
              placeholder="+880****"
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
            {errors.reciverNumber && (
              <span className="text-sm text-link">
                {errors.reciverNumber.message}
              </span>
            )}
          </div>
        </div>
        <div className="md:flex items-center gap-10">
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Req* Delivery Date
            </label>
            <input
              {...register("reqDate")}
              required
              min={today}
              type="date"
              className="w-full px-3 py-1 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
          <div className="space-y-2 md:w-1/2">
            <label className="block text-sm text-headL dark:text-headD">
              Price (TK):
            </label>
            <input
              {...register("price")}
              type="number"
              readOnly
              className="w-full px-3 py-2 border rounded-md dark:border-link dark:bg-gray-50 dark:text-headL focus:dark:border-link"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
            <DialogTrigger asChild>
              <Lottie
                loop={true}
                animationData={mapicon}
                className=" w-[100px] mt-3"
              />
            </DialogTrigger>
            <DialogContent
              style={{
                width: "50vw",
                maxWidth: "850px",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <DialogTitle>Select a location on the map</DialogTitle>
              <MapLocation
                latitude={latitude}
                longitude={longitude}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                onLocationSelect={handleLocationSelect}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <button className="bg-butL dark:bg-butD hover:bg-butD hover:dark:bg-butL text-paraD dark:text-headL hover:dark:text-paraD hover:text-headL w-full px-8 py-3 font-semibold rounded-md">
        Update Parcel
      </button>
    </form>
  );
};

export default UpdateForm;

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Heart, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

interface BookingModalProps {
  companionId: string;
  companionName: string;
  trigger?: React.ReactNode;
}

const CATEGORIES = [
  { id: "conversation", label: "Conversation & Coffee", icon: "☕" },
  { id: "walking", label: "Outdoor Walking", icon: "👟" },
  { id: "errands", label: "Basic Errands", icon: "🛒" },
  { id: "hobby", label: "Hobby Sharing", icon: "🎨" },
];

const TIME_SLOTS = [
  "09:00 - 10:30",
  "10:30 - 12:00",
  "13:00 - 14:30",
  "14:30 - 16:00",
  "16:00 - 17:30",
];

export default function BookingModal({ companionId, companionName, trigger }: BookingModalProps) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleBooking = async () => {
    if (!user || !date || !slot || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        seekerId: user.uid,
        seekerName: user.displayName || "Someone",
        companionId,
        companionName,
        date: date.toISOString(),
        timeSlot: slot,
        serviceCategory: category,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Booking request sent!");
      setOpen(false);
      // Reset form
      setDate(undefined);
      setSlot(undefined);
      setCategory(undefined);
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to send booking request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
            Book Companion
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-[2rem] border-none shadow-2xl p-8 overflow-hidden font-sans">
        <DialogHeader className="mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
            <Heart className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Book {companionName}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-base">
            Select a service and time that works for you. All companions are background checked.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} className="space-y-6">
          {/* Service Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Service Type</label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="h-14 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-medium">
                <SelectValue placeholder="What would you like to do?" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-2xl border-gray-100 shadow-xl p-2">
                {CATEGORIES.map((cat) => (
                  <SelectItem 
                    key={cat.id} 
                    value={cat.id}
                    className="rounded-xl h-12 hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-full h-14 bg-gray-50 border-transparent rounded-2xl justify-start text-left font-medium transition-all hover:bg-gray-100",
                      !date && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white rounded-3xl border-gray-100 shadow-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 12096e5)} // 14 days limit
                    initialFocus
                    className="rounded-3xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Time Slot</label>
              <Select onValueChange={setSlot} value={slot}>
                <SelectTrigger className="h-14 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-medium">
                  <SelectValue placeholder="When?" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl border-gray-100 shadow-xl p-2">
                  {TIME_SLOTS.map((t) => (
                    <SelectItem 
                      key={t} 
                      value={t}
                      className="rounded-xl h-12 hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                    >
                      <Clock className="w-4 h-4 mr-2 inline" />
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-10 sm:justify-start gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Confirm Booking"
              )}
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="w-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

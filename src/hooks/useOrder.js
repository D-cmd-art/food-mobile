import { useMutation,useQuery } from '@tanstack/react-query';
import {api} from "../utils/api";

export function useOrder(options) {
  return useMutation({
    mutationFn: async (data) => {  
      const res = await api.post('/orders/create', data); // ✅ corrected endpoint
      return res.data;
    },
    ...options,
  });
}
// template to send to the backend
//   const newOrder = new Order({
//       orderId,
//       userInfo: body.user, // now a single object
//       location: body.location,
//       totalPayment: body.totalPayment,
//       products: body.products,
//       deliveryNumber: body.deliveryNumber || body.user.phone || "",
//       status: body.status || "unpaid",
//       payment_method: body.payment_method || "cash",
//     });
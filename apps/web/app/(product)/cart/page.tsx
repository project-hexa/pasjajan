"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { useRouter } from "next/navigation";

// --- INTERFACE ---
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

// --- MAIN PAGE ---
export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // ---- FETCH PRODUK DARI BACKEND ----
  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setProducts(res.data.products);
        }
      })
      .catch(console.error);
  }, []);

  // ---- TAMBAH KE KERANJANG ----
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.product_id === product.id);

      if (exist) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  // ---- UPDATE QUANTITY ----
  const updateQty = (id: number, mode: "inc" | "dec") => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product_id === id
            ? {
                ...item,
                quantity:
                  mode === "inc"
                    ? item.quantity + 1
                    : Math.max(1, item.quantity - 1),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ---- HITUNG TOTAL ----
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 10000;
  const admin = 1000;
  const grandTotal = subTotal + shipping + admin;
  const router = useRouter();
  // ---- CHECKOUT ----
  
  const handleCheckout = async () => {
    localStorage.setItem("pasjajan_cart", JSON.stringify(cart));
  router.push("/payment");
    console.log("CHECKOUT CLICKED");
    console.log("Cart:", cart);
  
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
  
    const items = cart.map((item) => ({
      product_id: item.product_id,
      price: item.price,
      quantity: item.quantity,
    }));
  
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    const payload = {
      customer_id: 1,
      customer_name: "Test Customer",
      customer_email: "customer@test.com",
      customer_phone: "081234567890",
      address_id: 1,
      store_id: 1,
      shipping_address: "Jl. Kebon Jeruk No. 45, Jakarta Barat",
      shipping_recipient_name: "Test Customer",
      shipping_recipient_phone: "081234567890",
      items,
      sub_total: subTotal,
      discount: 0,
      shipping_fee: 10000,
      admin_fee: 1000,
      grand_total: subTotal + 11000,
      notes: "Belanja mart",
    };
  
    console.log("Checkout Payload:", payload);
  
    try {
      const res = await fetch("http://localhost:8000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      console.log("Status:", res.status);
      const data = await res.json();
      console.log("Checkout Response:", data);
  
      if (!data.success) {
        alert(data.message || "Checkout gagal");
        return;
      }
  
      const orderCode = data.data.order.code;
      console.log("Order Code:", orderCode);
  
      window.location.href = `/payment?order=${orderCode}`;
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Gagal menghubungi server");
    }
  };
  

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Pilih Produk</h1>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="font-semibold text-sm">
              {product.name}
            </CardHeader>

            <CardContent>
              <p className="text-sm mb-2">
                Harga: <strong>Rp {product.price.toLocaleString()}</strong>
              </p>

              <Button className="w-full" onClick={() => addToCart(product)}>
                Tambah ke Keranjang
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CART */}
      <div>
        <h2 className="text-lg font-bold mt-6">Keranjang Belanja</h2>

        {cart.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">
            Belum ada item di keranjang.
          </p>
        ) : (
          <>
            {cart.map((item) => (
              <Card key={item.product_id} className="mt-4">
                <CardHeader className="pb-2 font-semibold">
                  {item.name}
                </CardHeader>

                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span>Harga</span>
                    <span>Rp {item.price.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between mt-3 text-sm">
                    <span>Quantity</span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQty(item.product_id, "dec")}
                      >
                        -
                      </Button>

                      <span>{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQty(item.product_id, "inc")}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* TOTAL */}
            <Card className="mt-6">
              <CardContent className="pt-4">
                <div className="flex justify-between text-md font-bold">
                  <span>Subtotal</span>
                  <span>Rp {subTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span>Shipping</span>
                  <span>Rp {shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Admin Fee</span>
                  <span>Rp {admin.toLocaleString()}</span>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rp {grandTotal.toLocaleString()}</span>
                </div>

                <Button className="w-full mt-4" onClick={handleCheckout}>
                  Lanjut Checkout
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

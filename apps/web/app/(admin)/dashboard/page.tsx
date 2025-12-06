"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Search,
  Settings,
  Home,
  FileText,
  Users,
  ShoppingCart,
  Boxes,
  Tag,
  Bell,
  Activity,
  ChevronDown,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: string;
  status?: string;
  image: string;
  description?: string;
};

const sidebarLinks = [
  { label: "Dashboard", icon: Home },
  { label: "Laporan Penjualan", icon: FileText },
  { label: "Pelanggan", icon: Users },
  { label: "Penjualan", icon: ShoppingCart },
  { label: "Produk", icon: Boxes, active: true },
  { label: "Promosi & Diskon", icon: Tag },
  { label: "Notifikasi", icon: Bell },
  { label: "Log Aktivitas", icon: Activity },
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: "MieIndomie",
    category: "Makanan",
    price: "Rp123.131.020",
    stock: "3.000",
    status: "Aktif",
    image: "/images/Screenshot 2025-10-25 174036.png",
  },
  {
    id: 2,
    name: "MieIndomie",
    category: "Makanan",
    price: "Rp123.131.020",
    stock: "3.000",
    status: "Aktif",
    image: "/images/Screenshot 2025-10-25 174142.png",
  },
  {
    id: 3,
    name: "MieIndomie",
    category: "Makanan",
    price: "Rp123.131.020",
    stock: "3.000",
    status: "Aktif",
    image: "/images/Screenshot 2025-10-25 174230.png",
  },
];

export default function DashboardPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [products, setProducts] = useState(initialProducts);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const handleAddProductClick = () => {
    setEditingProductId(null);
    setFormValues({ name: "", description: "", price: "", category: "Makanan", stock: "", image: "" });
    setShowProductForm(true);
  };

  const handleFormChange = (field: keyof typeof formValues) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const imagePath = formValues.image?.startsWith("/") ? formValues.image : `/images/${formValues.image}`;

    if (editingProductId != null) {
      // update existing
      setProducts((prev) => prev.map((p) => (p.id === editingProductId ? {
        ...p,
        name: formValues.name,
        category: formValues.category,
        price: `Rp${formValues.price}`,
        stock: formValues.stock,
        image: imagePath,
      } : p)));
      setEditingProductId(null);
    } else {
      const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
      const newProduct = {
        id: nextId,
        name: formValues.name,
        category: formValues.category,
        price: `Rp${formValues.price}`,
        stock: formValues.stock,
        status: "Aktif",
        image: imagePath,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setShowProductForm(false);
    setFormValues({ name: "", description: "", price: "", category: "Makanan", stock: "", image: "" });
  };

  const handleCancel = () => {
    setShowProductForm(false);
  };

  const handleView = (product: Product) => {
    setViewProduct(product);
  };

  const handleCloseView = () => setViewProduct(null);

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    // strip Rp prefix if present
    const priceValue = typeof product.price === "string" ? product.price.replace(/^Rp\s?/, "") : "";
    // strip leading /images/ for the form to be consistent with earlier behavior
    const imageValue = typeof product.image === "string" ? product.image.replace(/^\/images\//, "") : "";
    setFormValues({
      name: product.name || "",
      description: product.description || "",
      price: priceValue,
      category: product.category || "Makanan",
      stock: product.stock || "",
      image: imageValue,
    });
    setShowProductForm(true);
  };

  const handleDelete = (product: Product) => {
    const ok = confirm(`Hapus produk "${product.name}"?`);
    if (!ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    // if currently viewing/editing that product, close
    if (viewProduct?.id === product.id) setViewProduct(null);
    if (editingProductId === product.id) {
      setEditingProductId(null);
      setShowProductForm(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-[#F7FFFB]">
      dashboard
    </div>
  );
}

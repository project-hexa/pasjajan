"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Search, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
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

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image: string;
  status: string;
};

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

const categoryOptions = ["Semua", "Makanan", "Minuman", "Snack"];
const statusOptions = ["Semua", "Aktif", "Tidak Aktif"];
const timeRanges = [
  { value: "last3months", label: "Last 3 months" },
  { value: "last30days", label: "Last 30 days" },
  { value: "last7months", label: "Last 7 months" },
];
const fallbackProductImage = initialProducts[0]?.image ?? "/images/placeholder.png";

const getDefaultFormValues = (): ProductFormValues => ({
  name: "",
  description: "",
  price: "",
  category: "Makanan",
  stock: "",
  image: "",
  status: "Aktif",
});

const formatCurrency = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Rp0";
  return `Rp${Number(digits).toLocaleString("id-ID")}`;
};

const formatNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "0";
  return Number(digits).toLocaleString("id-ID");
};

export default function ProductsDashboardPage() {
  const [selectedRange, setSelectedRange] = useState(
    timeRanges[0]?.value ?? "last3months",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<ProductFormValues>(
    () => getDefaultFormValues(),
  );
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const categoryMenuRef = useRef<HTMLDivElement | null>(null);
  const statusMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }

      if (
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = normalizedSearch
        ? product.name.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesCategory =
        selectedCategory === "Semua" || product.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "Semua" || product.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const handleAddProductClick = () => {
    setEditingProductId(null);
    setFormValues(getDefaultFormValues());
    setShowProductForm(true);
  };

  const handleFormChange =
    (field: keyof ProductFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedPrice = formatCurrency(formValues.price);
    const formattedStock = formatNumber(formValues.stock);
    const descriptionValue = formValues.description.trim();
    const statusValue = formValues.status || "Aktif";
    const imagePath = formValues.image
      ? formValues.image.startsWith("/")
        ? formValues.image
        : `/images/${formValues.image}`
      : fallbackProductImage;

    if (editingProductId != null) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                name: formValues.name,
                category: formValues.category,
                price: formattedPrice,
                stock: formattedStock,
                image: imagePath,
                status: statusValue,
                description: descriptionValue,
              }
            : product,
        ),
      );
      setEditingProductId(null);
    } else {
      const nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
      const newProduct: Product = {
        id: nextId,
        name: formValues.name,
        category: formValues.category,
        price: formattedPrice,
        stock: formattedStock,
        status: statusValue,
        image: imagePath,
        description: descriptionValue,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setShowProductForm(false);
    setFormValues(getDefaultFormValues());
  };

  const handleCancel = () => {
    setShowProductForm(false);
    setEditingProductId(null);
    setFormValues(getDefaultFormValues());
  };

  const handleView = (product: Product) => {
    setViewProduct(product);
  };

  const handleCloseView = () => setViewProduct(null);

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);

    const priceValue = typeof product.price === "string"
      ? product.price.replace(/\D/g, "")
      : "";
    const stockValue = typeof product.stock === "string"
      ? product.stock.replace(/\D/g, "")
      : "";
    const imageValue = typeof product.image === "string"
      ? product.image.startsWith("/images/")
        ? product.image.replace(/^\/images\//, "")
        : product.image.replace(/^\//, "")
      : "";

    setFormValues({
      name: product.name || "",
      description: product.description || "",
      price: priceValue,
      category: product.category || "Makanan",
      stock: stockValue,
      image: imageValue,
      status: product.status || "Aktif",
    });
    setShowProductForm(true);
  };

  const handleDelete = (product: Product) => {
    const ok = confirm(`Hapus produk "${product.name}"?`);
    if (!ok) return;

    setProducts((prev) => prev.filter((item) => item.id !== product.id));

    if (viewProduct?.id === product.id) setViewProduct(null);
    if (editingProductId === product.id) {
      setEditingProductId(null);
      setShowProductForm(false);
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="relative rounded-3xl bg-[#F7FFFB] p-6 text-[#125635] shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-[#0F5F3D]">Produk</h2>
          <p className="text-sm text-[#4B7358]">Kelola seluruh daftar produk PasJajan dengan mudah.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full flex-1 items-center gap-3 rounded-full bg-[#F0F7F2] px-6 py-3"
            >
              <Search className="h-5 w-5 text-[#1E8F59]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari produk"
                className="flex-1 bg-transparent text-sm text-[#125635] placeholder:text-[#6CA086] focus:outline-none"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => setSelectedRange(range.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    selectedRange === range.value
                      ? "bg-[#1E8F59] text-white"
                      : "bg-[#F0F7F2] text-[#4B7358] hover:bg-[#E0EFE5]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative" ref={categoryMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-full border border-[#B9DCCC] bg-white px-4 py-2 text-sm font-medium text-[#125635] transition ${
                    isCategoryOpen ? "bg-[#E3F2EA]" : "hover:bg-[#F0F7F2]"
                  }`}
                >
                  <span>Kategori</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isCategoryOpen && (
                  <div className="absolute left-0 top-[110%] z-20 w-44 rounded-2xl border border-[#C9E3D4] bg-white p-2 shadow-lg">
                    {categoryOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(option);
                          setIsCategoryOpen(false);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                          selectedCategory === option
                            ? "bg-[#1E8F59] text-white"
                            : "text-[#125635] hover:bg-[#F0F7F2]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="rounded-full border border-[#B9DCCC] bg-white px-4 py-2 text-sm font-medium text-[#125635] transition hover:bg-[#F0F7F2]"
              >
                Filter
              </button>

              <div className="relative" ref={statusMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-full border border-[#B9DCCC] bg-white px-4 py-2 text-sm font-medium text-[#125635] transition ${
                    isStatusOpen ? "bg-[#E3F2EA]" : "hover:bg-[#F0F7F2]"
                  }`}
                >
                  <span>Status</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isStatusOpen && (
                  <div className="absolute left-0 top-[110%] z-20 w-40 rounded-2xl border border-[#C9E3D4] bg-white p-2 shadow-lg">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedStatus(option);
                          setIsStatusOpen(false);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                          selectedStatus === option
                            ? "bg-[#1E8F59] text-white"
                            : "text-[#125635] hover:bg-[#F0F7F2]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddProductClick}
              className="rounded-full bg-[#05A9D6] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0495BC]"
            >
              + Tambah Produk
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#C9E3D4] bg-white shadow-sm">
          <table className="min-w-full table-fixed">
            <thead className="bg-[#B9DCCC] text-sm font-semibold uppercase text-[#125635]">
              <tr>
                <th className="px-6 py-3 text-left">Gambar</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-left">Harga</th>
                <th className="px-6 py-3 text-left">Stok</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-[#4B7358]" colSpan={7}>
                    Tidak ada produk yang sesuai dengan filter saat ini.
                  </td>
                </tr>
              )}

              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-[#E6F1EA] text-sm text-[#125635]">
                  <td className="px-6 py-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#E6F1EA]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === "Aktif"
                          ? "bg-[#D6F5E5] text-[#0F5F3D]"
                          : "bg-[#FDE2DE] text-[#B64731]"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Lihat produk"
                        onClick={() => handleView(product)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E8F59]/10 text-[#1E8F59] transition hover:bg-[#1E8F59]/20"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Edit produk"
                        onClick={() => handleEdit(product)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#05A9D6]/10 text-[#05A9D6] transition hover:bg-[#05A9D6]/20"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Hapus produk"
                        onClick={() => handleDelete(product)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAD4D0] text-[#C94C3B] transition hover:bg-[#F8C2BB]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showProductForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 text-[#125635] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {editingProductId != null ? "Edit Produk" : "Tambah Produk"}
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full bg-[#F0F7F2] px-3 py-1 text-sm font-medium text-[#4B7358] hover:bg-[#E0EFE5]"
              >
                Tutup
              </button>
            </div>

            <label className="block text-sm font-medium">
              Nama Produk
              <input
                required
                value={formValues.name}
                onChange={handleFormChange("name")}
                className="mt-1 w-full rounded-2xl border border-[#C9E3D4] bg-white px-3 py-2 text-sm outline-none focus:border-[#1E8F59]"
                placeholder="Masukkan nama produk"
              />
            </label>

            <label className="block text-sm font-medium">
              Deskripsi
              <textarea
                value={formValues.description}
                onChange={handleFormChange("description")}
                className="mt-1 h-24 w-full resize-none rounded-2xl border border-[#C9E3D4] bg-white px-3 py-2 text-sm outline-none focus:border-[#1E8F59]"
                placeholder="Tambahkan deskripsi produk"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm font-medium">
                Harga
                <input
                  required
                  value={formValues.price}
                  onChange={handleFormChange("price")}
                  className="mt-1 w-full rounded-2xl border border-[#C9E3D4] bg-white px-3 py-2 text-sm outline-none focus:border-[#1E8F59]"
                  placeholder="Contoh: 150000"
                />
              </label>

              <label className="block text-sm font-medium">
                Stok
                <input
                  required
                  value={formValues.stock}
                  onChange={handleFormChange("stock")}
                  className="mt-1 w-full rounded-2xl border border-[#C9E3D4] bg-white px-3 py-2 text-sm outline-none focus:border-[#1E8F59]"
                  placeholder="Contoh: 50"
                />
              </label>

              <label className="block text-sm font-medium">
                Kategori
                <select
                  value={formValues.category}
                  onChange={handleFormChange("category")}
                  className="mt-1 w-full rounded-2xl border border-[#C9E3D4] bg-white px-3 py-2 text-sm outline-none focus:border-[#1E8F59]"
                >
                  {categoryOptions
                    .filter((option) => option !== "Semua")
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Status
                <select
                  value={formValues.status}
                  onChange={handleFormChange("status")}
                  className="mt-1 w-full rounded-2xl border border-[#C9E3D4] bg-white px-3 py-2 text-sm outline-none focus:border-[#1E8F59]"
                >
                  {statusOptions
                    .filter((option) => option !== "Semua")
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium">
              URL Gambar / Path
              <input
                value={formValues.image}
                onChange={handleFormChange("image")}
                className="mt-1 w-full rounded-2xl border border-[#C9E3D4] bg-white px-3 py-2 text-sm outline-none focus:border-[#1E8F59]"
                placeholder="Contoh: produk.png"
              />
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-[#B9DCCC] px-5 py-2 text-sm font-semibold text-[#4B7358] transition hover:bg-[#F0F7F2]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#1E8F59] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#166943]"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      )}

      {viewProduct && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 text-[#125635] shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Detail Produk</h3>
              <button
                type="button"
                onClick={handleCloseView}
                className="rounded-full bg-[#F0F7F2] px-3 py-1 text-sm font-medium text-[#4B7358] hover:bg-[#E0EFE5]"
              >
                Tutup
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#E6F1EA]">
                <Image
                  src={viewProduct.image}
                  alt={viewProduct.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold">{viewProduct.name}</h4>
                <p className="text-sm text-[#4B7358]">{viewProduct.category}</p>
                <p className="text-sm font-medium text-[#1E8F59]">{viewProduct.price}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#4B7358]">
              <p>
                <span className="font-semibold text-[#125635]">Status:</span> {viewProduct.status}
              </p>
              <p>
                <span className="font-semibold text-[#125635]">Stok:</span> {viewProduct.stock}
              </p>
              <p>
                <span className="font-semibold text-[#125635]">Deskripsi:</span> {viewProduct.description || "Belum ada deskripsi."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

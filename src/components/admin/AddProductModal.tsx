import { useState, useEffect } from "react";
import { createProductApi, updateProductApi } from "../../services/product.api";
import toast from "react-hot-toast";

const AddProductModal = ({ open, onClose, refresh, editData }: any) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    category: "Electronics",
    description: "",
    mrp: "",
    sellingPrice: "",
    quantity: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // 🔥 PREFILL EDIT DATA
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        brand: editData.brand || "",
        category: editData.category || "Electronics",
        description: editData.description || "",
        mrp: editData.mrp || "",
        sellingPrice: editData.sellingPrice || "",
        quantity: editData.quantity || "",
      });

      setPreview(editData.images?.map((img: any) => img.url) || []);
      setImages([]); // reset file
    } else {
      setForm({
        title: "",
        brand: "",
        category: "Electronics",
        description: "",
        mrp: "",
        sellingPrice: "",
        quantity: "",
      });
      setPreview([]);
      setImages([]);
    }
  }, [editData]);

  if (!open) return null;

  // 🔥 IMAGE CHANGE
  const handleImage = (e: any) => {
    const files = Array.from(e.target.files);
    setImages(files as File[]);

    const urls = files.map((file: any) => URL.createObjectURL(file));
    setPreview(urls);
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editData) {
        // 🔥 UPDATE
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        // 🔥 IMAGE ADD
        if (images.length > 0) {
          images.forEach((img) => {
            formData.append("images", img);
          });
        }

        await updateProductApi(editData._id, formData);

        toast.success("Product updated ✏️");
      } else {
        // 🔥 CREATE
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        images.forEach((img) => {
          formData.append("images", img);
        });

        await createProductApi(formData);

        toast.success("Product added 🚀");
      }

      refresh();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      {/* MODAL */}
      <div className="bg-[#020617] w-[520px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-xl font-bold">
          {editData ? "Edit Product ✏️" : "Add Product 🚀"}
        </h2>

        {/* INPUTS */}
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          placeholder="Brand"
          className="w-full p-2 bg-gray-800 rounded"
        />


        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
          <option>Books</option>
          <option>Other</option>
        </select>

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full p-2 bg-gray-800 rounded"
        />

        <div className="flex gap-2">
          <input
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            placeholder="MRP"
            className="w-full p-2 bg-gray-800 rounded"
          />

          <input
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
            placeholder="Selling Price"
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>

        <input
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Quantity"
          className="w-full p-2 bg-gray-800 rounded"
        />

        {/* IMAGE INPUT */}
        <input type="file" multiple onChange={handleImage} />

        {/* PREVIEW */}
        <div className="flex gap-2 flex-wrap">
          {preview.length > 0 ? (
            preview.map((img, i) => (
              <img
                key={i}
                src={img}
                className="h-16 w-16 object-cover rounded border"
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No image</p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            {loading ? "Saving..." : editData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;

"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, UtensilsCrossed } from "lucide-react";
import { useRestaurant } from "@/components/restaurant/restaurant-provider";

type StockFilter = "all" | "in" | "out";

export default function AdminMenuPage() {
  const { items, addMenuItem, removeMenuItem } = useRestaurant();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [tableMessage, setTableMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (!name.trim() || !Number.isFinite(numericPrice) || numericPrice < 0 || !Number.isInteger(numericStock) || numericStock < 0) {
      setMessage("Enter a valid name, price and whole-number stock.");
      return;
    }
    setSaving(true);
    const result = await addMenuItem({
      name: name.trim(),
      price: numericPrice,
      stock: numericStock,
      image: image.trim(),
    });
    setMessage(result.message);
    if (result.success || result.message.includes("browser")) {
      setName("");
      setPrice("");
      setStock("");
      setImage("");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const result = await removeMenuItem(id);
    setTableMessage(result.message);
    setPendingDeleteId(null);
    setDeletingId(null);
  };

  const categoryOptions = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category))).sort()],
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        String(item.id).includes(query);
      const matchesCategory = category === "All" || item.category === category;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in" ? item.stock > 0 : item.stock <= 0);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [items, search, category, stockFilter]);

  const hasFilters = search !== "" || category !== "All" || stockFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStockFilter("all");
  };

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
        Catalogue
      </p>
      <h1 className="mt-2 font-display text-4xl text-on-surface">Menu items</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Add new items to the menu. Items are written to your Apps Script sheet.
      </p>

      <div className="mt-8 grid gap-8 xl:grid-cols-[380px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-3xl border border-outline-variant bg-surface p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-primary">
              <Plus size={17} />
            </span>
            <h2 className="font-display text-xl text-on-surface">Add an item</h2>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                Item name
              </span>
              <input
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Chicken Burger"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                  Price (₹)
                </span>
                <input
                  className={inputClass}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  inputMode="numeric"
                  placeholder="100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                  Stock
                </span>
                <input
                  className={inputClass}
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  inputMode="numeric"
                  placeholder="20"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                Image URL (optional)
              </span>
              <input
                className={inputClass}
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://..."
              />
            </label>
            {message && <p className="text-xs text-secondary">{message}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-primary py-3 text-xs font-semibold uppercase tracking-widest text-on-primary hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add item"}
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-3xl border border-outline-variant bg-surface">
          <div className="border-b border-outline-variant px-6 py-4">
            <h2 className="font-display text-xl text-on-surface">
              {`Current menu (${filteredItems.length}${hasFilters ? ` of ${items.length}` : ""})`}
            </h2>
          </div>
          <div className="flex flex-wrap items-end gap-3 border-b border-outline-variant px-6 py-4">
            <label className="min-w-[200px] flex-1">
              <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                Search items
              </span>
              <span className="relative block">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                />
                <input
                  className={`${inputClass} pl-9`}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name or ID"
                />
              </span>
            </label>
            <label className="w-full sm:w-44">
              <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                Category
              </span>
              <select
                className={inputClass}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="w-full sm:w-40">
              <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                Stock
              </span>
              <select
                className={inputClass}
                value={stockFilter}
                onChange={(event) =>
                  setStockFilter(event.target.value as StockFilter)
                }
              >
                <option value="all">All stock</option>
                <option value="in">In stock</option>
                <option value="out">Out of stock</option>
              </select>
            </label>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-outline px-4 py-3 text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
              >
                Clear
              </button>
            )}
          </div>
          {tableMessage && (
            <p className="border-b border-outline-variant px-6 py-2 text-xs text-secondary">
              {tableMessage}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface-container text-[11px] uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-6 py-3 font-semibold">Item</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Stock</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-10 w-10 shrink-0 rounded-lg bg-cover bg-center"
                          style={{
                            backgroundImage: item.image
                              ? `url("${item.image}")`
                              : "linear-gradient(135deg, #fed7aa, #c2410c)",
                          }}
                        />
                        <div>
                          <p className="font-medium text-on-surface">{item.name}</p>
                          <p className="text-[11px] text-on-surface-variant">
                            ID {item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-on-surface">
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          item.stock > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {pendingDeleteId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-lg bg-error px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-60"
                          >
                            {deletingId === item.id ? "Removing..." : "Remove"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            className="rounded-lg border border-outline px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-error"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="px-6 py-16 text-center">
              <UtensilsCrossed className="mx-auto mb-3 text-secondary" size={28} />
              <p className="font-display text-xl text-on-surface">
                {items.length === 0 ? "No items yet" : "No items match these filters"}
              </p>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl border border-outline px-4 py-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

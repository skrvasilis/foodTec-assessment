import { useEffect, useState } from "react";
import "./App.css";
import { items, itemPrices, itemSizes } from "../public/data";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { PiArrowArcLeftBold } from "react-icons/pi";

interface SizeState {
  sizeId: number;
  sizeName: string;
  price: number;
  enabled: boolean;
}

interface MenuItemState {
  itemId: number;
  name: string;
  sizes: SizeState[];
}

function buildInitialData(): MenuItemState[] {
  return items.map((item) => {
    const prices = itemPrices.filter((p) => p.itemId === item.itemId);
    return {
      itemId: item.itemId,
      name: item.name,
      sizes: itemSizes.map((size) => {
        const priceEntry = prices.find((p) => p.sizeId === size.sizeId);
        return {
          sizeId: size.sizeId,
          sizeName: size.name,
          price: priceEntry?.price ?? 0,
          enabled: true,
        };
      }),
    };
  });
}

function App() {
  const [menuItems, setMenuItems] = useState<MenuItemState[]>(() => {
    const saved = localStorage.getItem("menuItems");
    return saved ? JSON.parse(saved) : buildInitialData();
  });

  const [activeItemId, setActiveItemId] = useState<number | null>(() => {
    const stored = localStorage.getItem('activeItemId');
    return stored !== null ? parseInt(stored, 10) : null;
  });
  const [initialData] = useState<MenuItemState[]>(buildInitialData());

  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);


  useEffect(() => {
    if (activeItemId !== null) {
      localStorage.setItem('activeItemId', activeItemId.toString());
    } else {
      localStorage.removeItem('activeItemId');
    }
  }, [activeItemId]);


  const handleActiveItem = (itemId: number): void => {
    if (itemId === activeItemId) {
      setActiveItemId(null);
    } else {
      setActiveItemId(itemId);
    }
  };

  const handleToggleSize = (itemId: number, sizeId: number): void => {
    const initialItem = initialData.find((item) => item.itemId === itemId);
    const initialPrice = initialItem?.sizes.find(
      (item) => item.sizeId === sizeId
    );
    const newMenuItems = menuItems.map((item) => {
      if (item.itemId === itemId) {
        return {
          ...item,
          sizes: item.sizes.map((size) => {
            if (size.sizeId === sizeId && size.price !== 0.0) {
              return { ...size, enabled: !size.enabled, price: 0.0 };
            } else if (size.sizeId === sizeId && size.price == 0.0) {
              return {
                ...size,
                enabled: !size.enabled,
                price: initialPrice?.price,
              };
            } else {
              return size;
            }
          }),
        };
      }
      return item;
    });
    setMenuItems(newMenuItems);
  };

  const handlePriceChange = (
    itemId: number,
    sizeId: number,
    price: number
  ): void => {
    const newMenuItems = menuItems.map((item) => {
      if (item.itemId === itemId) {
        return {
          ...item,
          sizes: item.sizes.map((size) => {
            if (size.sizeId === sizeId) {
              return { ...size, price: price };
            }
            return size;
          }),
        };
      }
      return item;
    });
    setMenuItems(newMenuItems);
  };

  const hasChanges = (item: MenuItemState): boolean => {
    const initialItem = initialData.find(
      (menuItem) => menuItem.itemId == item.itemId
    );
    return JSON.stringify(item) !== JSON.stringify(initialItem);
  };

  const handleUndo = (): void => {
    setMenuItems(initialData);
  };

  return (
    <section className="menu">
      <h2>Pizza</h2>
      {menuItems.map((item) => (
        <section className="accordion-item" key={item.itemId}>
          <button
            className={`accordion-btn ${
              activeItemId === item.itemId ? "active" : ""
            }`}
            onClick={() => handleActiveItem(item.itemId)}
          >
            {activeItemId === item.itemId ? (
              <FaAngleUp className="btn-icon" />
            ) : (
              <FaAngleDown className="btn-icon" />
            )}
            {item.name}
          </button>
          {activeItemId === item.itemId && (
            <div className="pizza-container">
              {item.sizes.map((size) => (
                <div key={size.sizeId} className="size-row">
                  <input
                    type="checkbox"
                    id={`size ${item.itemId} ${size.sizeId}`}
                    checked={size.enabled}
                    onChange={() => handleToggleSize(item.itemId, size.sizeId)}
                  />
                  <label
                    className="check-label"
                    htmlFor={`size ${item.itemId} ${size.sizeId}`}
                  >
                    {" "}
                    {size.sizeName}{" "}
                  </label>
                  <div className="input-container">
                    <label>$ </label>

                    <input
                      type="number"
                      disabled={!size.enabled}
                      value={size.price}
                      onChange={(e) =>
                        handlePriceChange(
                          item.itemId,
                          size.sizeId,
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {hasChanges(item) && (
                <button className="undo-btn" onClick={handleUndo}>
                  <PiArrowArcLeftBold />
                </button>
              )}
            </div>
          )}
        </section>
      ))}
    </section>
  );
}

export default App;

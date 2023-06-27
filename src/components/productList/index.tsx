import { useCallback, useEffect, useRef, useState } from "react";
import useProductsStore from "../../store/useProductsStore";
import Products from "./Products";
import { debounce, isEmpty } from "lodash";

const ProductList = () => {
  const [isEnd, setEnd] = useState<boolean>(false);
  const elementRef = useRef<HTMLInputElement>(null);

  const {
    searchQuery,
    products,
    total,
    fetchProducts,
    setSearchQuery,
    loadMore,
  } = useProductsStore();

  //handle input changed with debounce
  const handleInputChange = useCallback(
    debounce(() => {
      fetchProducts();
    }, 400),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    handleInputChange();
  };

  //check scroll to bottom
  const isBottom = (el: HTMLElement | null) => {
    if (!el) {
      return false;
    }

    const rect = el.getBoundingClientRect();
    return rect.bottom <= window?.innerHeight;
  };

  //handle scroll
  const handleScroll = useCallback(
    debounce(() => {
      if (products?.length < total) {
        if (isBottom(elementRef?.current)) {
          loadMore();
        }
        return;
      }
      setEnd(true);
    }, 400),
    [products?.length, total]
  );

  //first render list 20 items
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products?.length < total) {
      setEnd(false);
      return;
    }
    setEnd(true);
  }, [products?.length, total]);

  useEffect(() => {
    try {
      window.removeEventListener("scroll", handleScroll);
    } catch (error) {
      console.log(error);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [products?.length, total]);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-300 text-left">
          Search in List Products
        </h2>

        <div>
          <label
            htmlFor="default-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          ></label>
          <input
            type="text"
            id="default-input"
            placeholder="Search ...."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={searchQuery}
            onChange={handleChange}
          />
        </div>

        <div className="mx-auto max-w-2xl px-2 py-10 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
          <div
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8"
            ref={elementRef}
          >
            {!isEmpty(products) ? (
              products?.map((item, index) => {
                return <Products key={item?.id || index} item={item} />;
              })
            ) : (
              <>No Data to display</>
            )}
          </div>
          {isEnd && (
            <div className="text-red-500 transition pt-4 text-2xl ml-auto mr-auto">
              End of the data list
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

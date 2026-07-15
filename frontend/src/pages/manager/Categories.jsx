import { useEffect, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import api from "../../services/api";

import AddCategoryModal from "../../components/category/AddCategoryModal";
import EditCategoryModal from "../../components/category/EditCategoryModal";
import DeleteCategoryModal from "../../components/category/DeleteCategoryModal";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {

    try {

      const response = await api.get("/manager/categories");

      setCategories(response.data.categories);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCategories();

  }, []);

  const handleEdit = (category) => {

    setSelectedCategory(category);

    setShowEditModal(true);

  };

  const handleDelete = (category) => {

    setSelectedCategory(category);

    setShowDeleteModal(true);

  };

  return (

    <ManagerLayout>

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Category Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Categories: {categories.length}
          </p>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          + Add Category
        </button>

      </div>

      {loading ? (

        <p>Loading...</p>

      ) : (

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-left p-4">
                  Description
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-center p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {categories.map((category) => (

                <tr
                  key={category.id}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {category.name}
                  </td>

                  <td className="p-4">
                    {category.description || "-"}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        category.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshCategories={fetchCategories}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        category={selectedCategory}
        refreshCategories={fetchCategories}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        category={selectedCategory}
        refreshCategories={fetchCategories}
      />

    </ManagerLayout>

  );

}

export default Categories;
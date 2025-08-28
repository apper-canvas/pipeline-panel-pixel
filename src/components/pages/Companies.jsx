import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import CompanyCard from "@/components/molecules/CompanyCard";
import CompanyModal from "@/components/organisms/CompanyModal";
import companyService from "@/services/api/companyService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Companies = () => {
  const { onMenuClick } = useOutletContext();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = async (companyId) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }

    try {
      await companyService.delete(companyId);
      await loadCompanies();
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (selectedCompany) {
        await companyService.update(selectedCompany.Id, companyData);
        toast.success("Company updated successfully");
      } else {
        await companyService.create(companyData);
        toast.success("Company created successfully");
      }
      await loadCompanies();
    } catch (error) {
      throw new Error("Failed to save company");
    }
  };

  const handleCompanyClick = (company) => {
    navigate(`/companies/${company.Id}`);
  };

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addButton = (
    <Button
      onClick={handleAddCompany}
      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
    >
      <ApperIcon name="Plus" size={16} className="mr-2" />
      Add Company
    </Button>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="min-h-screen">
      <Header
        title="Companies"
        subtitle="Manage company profiles and relationships"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search companies..."
        actionButton={addButton}
      />
      
      <div className="p-6">
        {filteredCompanies.length === 0 ? (
          <Empty
            title="No companies found"
            description={searchTerm ? "Try adjusting your search terms" : "Get started by adding your first company"}
            action={
              !searchTerm ? (
                <Button
                  onClick={handleAddCompany}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add First Company
                </Button>
              ) : null
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CompanyCard
                  company={company}
                  onClick={handleCompanyClick}
                  onEdit={handleEditCompany}
                  onDelete={handleDeleteCompany}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
      />
    </div>
  );
};

export default Companies;
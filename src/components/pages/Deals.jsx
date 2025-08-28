import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import DealColumn from "@/components/molecules/DealColumn";
import DealModal from "@/components/organisms/DealModal";
import MetricCard from "@/components/molecules/MetricCard";
import dealService from "@/services/api/dealService";
import { toast } from "react-toastify";
const Deals = () => {
  const { onMenuClick } = useOutletContext();

const [deals, setDeals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const pipelineStages = [
    { id: "lead", name: "Lead", color: "from-blue-400 to-blue-500" },
    { id: "qualified", name: "Qualified", color: "from-yellow-400 to-yellow-500" },
    { id: "proposal", name: "Proposal", color: "from-orange-400 to-orange-500" },
    { id: "negotiation", name: "Negotiation", color: "from-red-400 to-red-500" },
    { id: "closed-won", name: "Closed Won", color: "from-green-400 to-green-500" }
  ];

  useEffect(() => {
    loadDeals();
  }, []);

const loadDeals = async () => {
    try {
      setLoading(true);
      const dealsData = await dealService.getAll();
      const analyticsData = await dealService.getAnalytics();
      setDeals(dealsData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setEditingDeal(null);
    setShowModal(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowModal(true);
  };

  const handleDeleteDeal = async (dealId) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      await dealService.delete(dealId);
      setDeals(prev => prev.filter(d => d.Id !== dealId));
      toast.success("Deal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
        const updatedDeal = await dealService.update(editingDeal.Id, dealData);
        setDeals(prev => prev.map(d => d.Id === editingDeal.Id ? updatedDeal : d));
        toast.success("Deal updated successfully");
      } else {
        const newDeal = await dealService.create(dealData);
        setDeals(prev => [...prev, newDeal]);
        toast.success("Deal created successfully");
      }
      setShowModal(false);
      // Reload analytics after changes
      const analyticsData = await dealService.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      throw error; // Let modal handle the error
    }
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleDrop = async (stageId, deal) => {
    if (deal.stage === stageId) return;

    try {
      // Optimistic update
      setDeals(prev => prev.map(d => 
        d.Id === deal.Id ? { ...d, stage: stageId } : d
      ));

      // Update on server
await dealService.update(deal.Id, { 
        stage: stageId,
        stageChangedAt: new Date().toISOString()
      });
      toast.success(`Deal moved to ${pipelineStages.find(s => s.id === stageId)?.name}`);
    } catch (error) {
      // Revert on error
      setDeals(prev => prev.map(d => 
        d.Id === deal.Id ? { ...d, stage: deal.stage } : d
      ));
      toast.error("Failed to update deal stage");
    }
  };

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

return (
    <div className="min-h-screen">
      <Header
        title="Deals"
        subtitle="Track your sales pipeline and opportunities"
        onMenuClick={onMenuClick}
        actionButton={
          <Button onClick={handleAddDeal} className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={16} />
            <span>Add Deal</span>
          </Button>
        }
      />
      
<div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Analytics Section */}
            {analytics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Pipeline Value"
                    value={analytics.totalPipelineValue}
                    icon="DollarSign"
                    gradient="from-green-500 to-green-600"
                    change={analytics.valueChange}
                    changeType={analytics.valueChange?.startsWith('+') ? "positive" : "negative"}
                  />
                  <MetricCard
                    title="Active Deals"
                    value={analytics.totalDeals}
                    icon="Target"
                    gradient="from-blue-500 to-blue-600"
                    change={analytics.dealChange}
                    changeType={analytics.dealChange?.startsWith('+') ? "positive" : "negative"}
                  />
                  <MetricCard
                    title="Avg. Days in Pipeline"
                    value={`${analytics.avgDaysInPipeline} days`}
                    icon="Clock"
                    gradient="from-purple-500 to-purple-600"
                    change={analytics.cycleTimeChange}
                    changeType={analytics.cycleTimeChange?.startsWith('-') ? "positive" : "negative"}
                  />
                  <MetricCard
                    title="Bottleneck Stage"
                    value={analytics.bottleneckStage}
                    icon="AlertTriangle"
                    gradient="from-orange-500 to-orange-600"
                    change={`${analytics.bottleneckDays} days avg`}
                  />
                </div>
              </motion.div>
            )}

            {/* Pipeline Columns */}
            <div className="flex space-x-6 overflow-x-auto pb-6">
              {pipelineStages.map((stage, index) => (
                <DealColumn
                  key={stage.id}
                  stage={stage}
                  deals={getDealsForStage(stage.id)}
                  analytics={analytics?.stageAnalytics?.[stage.id]}
                  onEditDeal={handleEditDeal}
                  onDeleteDeal={handleDeleteDeal}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  draggedDeal={draggedDeal}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <DealModal
          deal={editingDeal}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveDeal}
        />
      )}
    </div>
  );
};

export default Deals;
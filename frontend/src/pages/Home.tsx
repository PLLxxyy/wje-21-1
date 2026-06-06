import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSpaces } from '@/hooks/useSpaces'
import { useAuth } from '@/hooks/useAuth'
import SpaceForm from '@/components/SpaceForm'
import { Plus, Trash2, Edit, Box, MapPin, AlertTriangle, Calendar } from 'lucide-react'
import api from '@/utils/api'
import { ItemWithSpace } from '@/types'
import { formatDate, getDaysUntilExpiry } from '@/utils/format'

export default function Home() {
  const { spaces, loading, createSpace, deleteSpace } = useSpaces()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [expiringItems, setExpiringItems] = useState<ItemWithSpace[]>([])
  const [expiryLoading, setExpiryLoading] = useState(true)

  useEffect(() => {
    const loadExpiringItems = async () => {
      if (!user?.expiryReminder) {
        setExpiryLoading(false)
        return
      }
      try {
        const res = await api.get('/items/expiring-soon', { params: { days: 30 } })
        setExpiringItems(res.data)
      } catch (e) {
        // ignore
      } finally {
        setExpiryLoading(false)
      }
    }
    loadExpiringItems()
  }, [user?.expiryReminder])

  const getExpiryBadgeClass = (days: number) => {
    if (days <= 0) return 'bg-red-100 text-red-700'
    if (days <= 7) return 'bg-orange-100 text-orange-700'
    if (days <= 14) return 'bg-yellow-100 text-yellow-700'
    return 'bg-blue-100 text-blue-700'
  }

  const getExpiryText = (days: number) => {
    if (days < 0) return `已过期 ${Math.abs(days)} 天`
    if (days === 0) return '今天过期'
    if (days === 1) return '明天过期'
    return `还有 ${days} 天`
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      {user?.expiryReminder && !expiryLoading && expiringItems.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">近期过期物品</h2>
            <span className="ml-auto text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              {expiringItems.length} 件
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {expiringItems.map(item => {
              const days = item.expiryDate ? getDaysUntilExpiry(item.expiryDate) : 0
              return (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="flex items-center gap-4 bg-white rounded-lg p-4 hover:shadow-sm transition-shadow border border-orange-100"
                >
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Box className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{item.spaceName}</span>
                      {item.quantity > 1 && (
                        <span className="text-gray-400">×{item.quantity}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getExpiryBadgeClass(days)}`}>
                      {getExpiryText(days)}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {item.expiryDate && formatDate(item.expiryDate)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">我的空间</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增空间
        </button>
      </div>

      {showForm && (
        <SpaceForm
          onSubmit={async (data) => {
            await createSpace(data)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spaces.map(space => (
          <Link
            key={space.id}
            to={`/spaces/${space.id}`}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Box className="w-6 h-6 text-emerald-600" />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (confirm('确定删除这个空间吗？')) {
                    deleteSpace(space.id)
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{space.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              {space.location}
            </div>
            {space.description && (
              <p className="mt-2 text-sm text-gray-400">{space.description}</p>
            )}
          </Link>
        ))}
      </div>

      {spaces.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Box className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无空间</p>
          <p className="text-sm mt-1">点击上方按钮添加第一个收纳空间</p>
        </div>
      )}
    </div>
  )
}

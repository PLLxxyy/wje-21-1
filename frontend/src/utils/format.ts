export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const diffMs = expiry.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export const TAG_COLORS: Record<string, string> = {
  '季节性': 'bg-blue-100 text-blue-700',
  '常用': 'bg-green-100 text-green-700',
  '易碎': 'bg-red-100 text-red-700',
  '贵重': 'bg-yellow-100 text-yellow-700',
  '食品': 'bg-orange-100 text-orange-700',
  '药品': 'bg-purple-100 text-purple-700',
}

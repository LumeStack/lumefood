'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Restaurant {
  id: string
  name: string
  description: string
  category: string
  address: string
  phone: string
  imageUrl: string | null
  isOpen: boolean
  minimumOrder: number
  deliveryFee: number
  deliveryTime: number
  rating: number
  reviewCount: number
}

const CATEGORIES = [
  'Pizza', 'Hambúrguer', 'Japonês', 'Sushi', 'Frango',
  'Árabe', 'Brasileiro', 'Italiana', 'Mexicano', 'Vegetariano', 'Chinês',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e5e5e5',
  borderRadius: '10px',
  fontSize: '14px',
  color: '#3E3E3E',
  background: '#fafafa',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#3E3E3E',
  marginBottom: '6px',
}

export default function AdminRestaurantePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    phone: '',
    imageUrl: '',
    isOpen: true,
    minimumOrder: '',
    deliveryFee: '',
    deliveryTime: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      if ((session?.user as { role?: string })?.role !== 'RESTAURANT_ADMIN') {
        router.push('/')
        return
      }
      fetchRestaurant()
    }
  }, [status])

  async function fetchRestaurant() {
    try {
      const res = await fetch('/api/admin/restaurante')
      if (!res.ok) throw new Error()
      const data: Restaurant = await res.json()
      setRestaurant(data)
      setForm({
        name: data.name,
        description: data.description,
        category: data.category,
        address: data.address,
        phone: data.phone,
        imageUrl: data.imageUrl ?? '',
        isOpen: data.isOpen,
        minimumOrder: String(data.minimumOrder),
        deliveryFee: String(data.deliveryFee),
        deliveryTime: String(data.deliveryTime),
      })
    } catch {
      toast.error('Erro ao carregar dados do restaurante')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        address: form.address,
        phone: form.phone,
        imageUrl: form.imageUrl || null,
        isOpen: form.isOpen,
        minimumOrder: parseFloat(form.minimumOrder.replace(',', '.')),
        deliveryFee: parseFloat(form.deliveryFee.replace(',', '.')),
        deliveryTime: parseInt(form.deliveryTime),
      }

      const res = await fetch('/api/admin/restaurante', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const updated = await res.json()
        setRestaurant(updated)
        toast.success('Restaurante atualizado com sucesso!')
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  function field(key: keyof typeof form) {
    return {
      value: form[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
      onFocus: (e: React.FocusEvent<HTMLElement>) =>
        ((e.currentTarget as HTMLElement).style.borderColor = '#EA1D2C'),
      onBlur: (e: React.FocusEvent<HTMLElement>) =>
        ((e.currentTarget as HTMLElement).style.borderColor = '#e5e5e5'),
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ padding: '32px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '12px', marginBottom: '16px' }} />
        ))}
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>😕</span>
        <p style={{ color: '#717171' }}>Restaurante não encontrado. Entre em contato com o suporte.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }} data-testid="admin-restaurant-page">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#3E3E3E', marginBottom: '4px' }}>
          Meu Restaurante
        </h1>
        <p style={{ color: '#717171', fontSize: '14px' }}>
          Gerencie as informações e configurações do seu restaurante
        </p>
      </div>

      {/* Status card */}
      <div
        data-testid="admin-restaurant-status-card"
        style={{
          background: form.isOpen ? '#DCFCE7' : '#FEE2E2',
          border: `1px solid ${form.isOpen ? '#BBF7D0' : '#FECACA'}`,
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ fontSize: '15px', fontWeight: '700', color: form.isOpen ? '#166534' : '#991B1B' }}>
            {form.isOpen ? '🟢 Restaurante aberto' : '🔴 Restaurante fechado'}
          </p>
          <p style={{ fontSize: '13px', color: form.isOpen ? '#166534' : '#991B1B', marginTop: '2px' }}>
            {form.isOpen
              ? 'Clientes podem fazer pedidos agora'
              : 'Clientes não conseguem fazer pedidos'}
          </p>
        </div>
        <button
          type="button"
          data-testid="admin-restaurant-toggle-open"
          onClick={() => setForm((f) => ({ ...f, isOpen: !f.isOpen }))}
          style={{
            padding: '10px 20px',
            background: form.isOpen ? '#991B1B' : '#166534',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          {form.isOpen ? 'Fechar restaurante' : 'Abrir restaurante'}
        </button>
      </div>

      <form onSubmit={handleSubmit} data-testid="admin-restaurant-form">
        {/* Informações gerais */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#3E3E3E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📋</span> Informações gerais
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nome do restaurante *</label>
              <input
                {...field('name')}
                required
                placeholder="Ex: Bella Napoli"
                data-testid="admin-restaurant-input-name"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Descrição</label>
              <textarea
                {...field('description')}
                rows={3}
                placeholder="Descreva seu restaurante..."
                data-testid="admin-restaurant-input-description"
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Categoria *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  required
                  data-testid="admin-restaurant-select-category"
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Telefone *</label>
                <input
                  {...field('phone')}
                  required
                  placeholder="11 3333-0001"
                  data-testid="admin-restaurant-input-phone"
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Endereço *</label>
              <input
                {...field('address')}
                required
                placeholder="Av. Paulista, 1200 - Bela Vista, São Paulo"
                data-testid="admin-restaurant-input-address"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>URL da imagem de capa</label>
              <input
                {...field('imageUrl')}
                type="url"
                placeholder="https://..."
                data-testid="admin-restaurant-input-image-url"
                style={inputStyle}
              />
              {form.imageUrl && (
                <div style={{ marginTop: '8px', borderRadius: '10px', overflow: 'hidden', height: '120px', background: `url(${form.imageUrl}) center/cover` }} />
              )}
            </div>
          </div>
        </div>

        {/* Configurações de entrega */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#3E3E3E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛵</span> Configurações de entrega
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Taxa de entrega (R$) *</label>
              <input
                {...field('deliveryFee')}
                required
                placeholder="5.99"
                data-testid="admin-restaurant-input-delivery-fee"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Pedido mínimo (R$) *</label>
              <input
                {...field('minimumOrder')}
                required
                placeholder="25.00"
                data-testid="admin-restaurant-input-minimum-order"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tempo de entrega (min) *</label>
              <input
                {...field('deliveryTime')}
                required
                placeholder="40"
                type="number"
                min="1"
                data-testid="admin-restaurant-input-delivery-time"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Stats (read-only) */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#3E3E3E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⭐</span> Avaliações
          </h2>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#717171', marginBottom: '4px' }}>Nota média</p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#FFB800' }}>
                {restaurant.rating.toFixed(1)} ★
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#717171', marginBottom: '4px' }}>Total de avaliações</p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#3E3E3E' }}>
                {restaurant.reviewCount}
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          data-testid="admin-restaurant-button-save"
          style={{
            width: '100%',
            padding: '14px',
            background: saving ? '#ccc' : '#EA1D2C',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLElement).style.background = '#C8151E' }}
          onMouseLeave={(e) => { if (!saving) (e.currentTarget as HTMLElement).style.background = '#EA1D2C' }}
        >
          {saving ? 'Salvando...' : '💾 Salvar alterações'}
        </button>
      </form>
    </div>
  )
}

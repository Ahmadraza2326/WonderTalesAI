import { ProfilePage } from './ProfilePage'
import { useI18n } from '../context/I18nContext'

export function SettingsPage() {
  const { setLocale } = useI18n()
  if (false as boolean) setLocale('English')

  return <ProfilePage initialTab="settings" />
}

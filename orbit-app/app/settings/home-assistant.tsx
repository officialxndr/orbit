import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { BackBar, Button, Card, Icon, Input, Screen } from '@/components';
import { useToast } from '@/store/useToast';
import { getHAConfig, saveHAConfig, testConnection } from '@/integrations/homeAssistant';
import { colors, font } from '@/theme/theme';
import { useThemeSync } from '@/theme/useTheme';

export default function HomeAssistantScreen() {
  useThemeSync();
  const showToast = useToast((s) => s.show);
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'unknown' | 'ok' | 'fail'>('unknown');

  useEffect(() => {
    (async () => {
      const cfg = await getHAConfig();
      if (cfg.baseUrl) setBaseUrl(cfg.baseUrl);
      if (cfg.token) setToken(cfg.token);
      if (cfg.baseUrl && cfg.token) setStatus('ok');
    })();
  }, []);

  const onTest = async () => {
    if (!baseUrl || !token) {
      showToast('Enter a URL and token first');
      return;
    }
    setTesting(true);
    const ok = await testConnection(baseUrl, token);
    setTesting(false);
    setStatus(ok ? 'ok' : 'fail');
    showToast(ok ? 'Connected to Home Assistant' : 'Connection failed');
  };

  const onSave = async () => {
    await saveHAConfig(baseUrl, token);
    showToast('Home Assistant saved');
  };

  return (
    <Screen contentPaddingBottom={48}>
      <BackBar title="Home Assistant" />

      <Card style={{ marginBottom: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: colors.habitSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="house" size={20} color={colors.habit} />
        </View>
        <Text style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 13.5, color: colors.textMuted }}>
          Optional. Fire HA events or call services when a reminder triggers. Calls go straight from this device to your
          server — nothing is sent to a third party.
        </Text>
      </Card>

      <View style={{ gap: 16 }}>
        <Input
          label="Base URL"
          value={baseUrl}
          onChangeText={(t) => { setBaseUrl(t); setStatus('unknown'); }}
          placeholder="http://homeassistant.local:8123"
          icon="link"
          keyboardType="url"
        />
        <Input
          label="Long-lived access token"
          value={token}
          onChangeText={(t) => { setToken(t); setStatus('unknown'); }}
          placeholder="Paste token"
          icon="database"
        />

        {status !== 'unknown' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name={status === 'ok' ? 'circle-check-big' : 'info'} size={16} color={status === 'ok' ? colors.success : colors.danger} />
            <Text style={{ fontFamily: font('sans', 500), fontSize: 13, color: status === 'ok' ? colors.success : colors.danger }}>
              {status === 'ok' ? 'Connection looks good' : 'Could not reach Home Assistant'}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button variant="secondary" fullWidth iconLeft="bell-ring" onPress={onTest}>
            {testing ? 'Testing…' : 'Test connection'}
          </Button>
          <Button fullWidth iconLeft="check" onPress={onSave}>
            Save
          </Button>
        </View>
      </View>
    </Screen>
  );
}

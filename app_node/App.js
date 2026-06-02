import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Provider as PaperProvider, RadioButton } from 'react-native-paper';

function FormularioContatos() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [sexo, setSexo] = useState('');
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [receberEmail, setReceberEmail] = useState(false);
  const [contatos, setContatos] = useState([]);
  const [proximoId, setProximoId] = useState(1);

  function adicionarContato() {
    if (nome.trim() === '') {
      Alert.alert('Atenção', 'Informe o nome para salvar.');
      return;
    }
    if (!aceitaTermos) {
      Alert.alert('Atenção', 'É necessário aceitar os Termos para salvar.');
      return;
    }

    const sexoDescricao =
      sexo === 'masculino' ? 'Masculino' : sexo === 'feminino' ? 'Feminino' : '—';

    const novo = {
      id: proximoId,
      nome,
      cpf,
      telefone,
      endereco,
      sexo: sexoDescricao,
      termos: 'Aceitos',
      emailInfo: receberEmail ? 'Sim' : 'Não'
    };

    setContatos(contatos.concat(novo));
    setProximoId(proximoId + 1);
    setNome('');
    setCpf('');
    setTelefone('');
    setEndereco('');
    setSexo('');
    setAceitaTermos(false);
    setReceberEmail(false);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.titulo}>Lista de Contatos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
      />

      <Text style={styles.rotulo}>Sexo</Text>
      <RadioButton.Group onValueChange={setSexo} value={sexo}>
        <View style={styles.opcaoLinha}>
          <RadioButton value="masculino" />
          <Text style={styles.opcaoTexto}>Masculino</Text>
        </View>
        <View style={styles.opcaoLinha}>
          <RadioButton value="feminino" />
          <Text style={styles.opcaoTexto}>Feminino</Text>
        </View>
      </RadioButton.Group>

      <View style={styles.opcaoLinha}>
        <Checkbox value={aceitaTermos} onValueChange={setAceitaTermos} />
        <Text style={styles.opcaoTexto}>Aceitar os Termos (obrigatório)</Text>
      </View>

      <View style={styles.opcaoLinha}>
        <Checkbox value={receberEmail} onValueChange={setReceberEmail} />
        <Text style={styles.opcaoTexto}>Quero receber informações por e-mail (opcional)</Text>
      </View>

      <Button title="Salvar" onPress={adicionarContato} />

      <View style={styles.lista}>
        {contatos.map(contato => (
          <View key={contato.id} style={styles.item}>
            <Text style={styles.itemTexto}>{contato.id} - {contato.nome}</Text>
            <Text style={styles.itemTexto}>CPF: {contato.cpf || '—'}</Text>
            <Text style={styles.itemTexto}>Telefone: {contato.telefone || '—'}</Text>
            <Text style={styles.itemTexto}>Endereço: {contato.endereco || '—'}</Text>
            <Text style={styles.itemTexto}>Sexo: {contato.sexo}</Text>
            <Text style={styles.itemTexto}>Termos: {contato.termos}</Text>
            <Text style={styles.itemTexto}>
              Informações por e-mail: {contato.emailInfo}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <FormularioContatos />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  titulo: {
    fontSize: 24,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10
  },
  rotulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  opcaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  opcaoTexto: {
    fontSize: 16,
    flexShrink: 1
  },
  lista: {
    marginTop: 20
  },
  item: {
    marginVertical: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  itemTexto: {
    fontSize: 16,
    marginVertical: 2
  }
});

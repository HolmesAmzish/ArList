function RegisterForm() {
    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = React.useState('');

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setMessage('🎉 注册成功，请登录');
        } else {
            const error = await response.json();
            setMessage(`❌ 注册失败: ${error.message || response.status}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">注册</h2>

            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="用户名"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
            />

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="邮箱"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
            />

            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="密码"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                注册
            </button>

            {message && <p className="text-center text-sm text-red-600 mt-2">{message}</p>}
        </form>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<RegisterForm />);

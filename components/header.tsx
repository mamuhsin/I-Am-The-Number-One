export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-8 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Caesar Cipher</h1>
            <p className="text-primary-foreground/80 mt-2">Master the art of classical cryptography</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Classical Encryption Tool</p>
          </div>
        </div>
      </div>
    </header>
  );
}
